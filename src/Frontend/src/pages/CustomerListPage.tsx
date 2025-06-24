import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExportXmlBtn from "./ChildComponents/ExportXmlBtn";

interface CustomerItem {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  category:{
    code: string;
    description: string;
  }
 
}

interface CustomerListQueryResult{
  customers: CustomerItem[];
  totalCount: number;
}

export default function CustomerListPage() {
  const [list, setList] = useState<CustomerItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  //#region Filters States
    const [emailFilter, setEmailFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [emailFilterToSend, setEmailFilterToSend] = useState("");
    const [nameFilterToSend, setNameFilterToSend] = useState("");
  //#endregion Filters States

  //#region Pagination States
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //#endregion Pagination States

  useEffect(() => {
    const fetchCustomers = async () => {

        const params = new URLSearchParams();

        //Pagination parameters
        params.append("currentPageNumber", currentPageNumber.toString());
        params.append("itemsPerPage", itemsPerPage.toString());

        //Filters parameters
        if (nameFilterToSend) {
            params.append("name", nameFilterToSend);
        }
        if (emailFilterToSend) {
            params.append("email", emailFilterToSend);
        }
    
        const url = `/api/customers/list?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json() as CustomerListQueryResult;
        const itemList = data.customers  as CustomerItem[];
        setList([...itemList]);
        setTotalItems(data.totalCount);
  }

  fetchCustomers()
}   , [currentPageNumber, itemsPerPage, nameFilterToSend, emailFilterToSend]);


useEffect(() => {
    const timer = setTimeout(() => {
        setNameFilterToSend(nameFilter);
        setEmailFilterToSend(emailFilter);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount or when dependencies change 
  },[nameFilter, emailFilter]);

  return (
    <>
    

      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <TextField id="outlined-basic" label="Filter by Name" variant="outlined"
        value={nameFilter}
        onChange={(e)=> setNameFilter(e.target.value)}/>

        <TextField id="outlined-basic" label="Filter by Email" variant="outlined"
        value={emailFilter}
        onChange={(e)=> setEmailFilter(e.target.value)}/>

        <ExportXmlBtn name={nameFilter} email={emailFilter} />
    </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Iban</StyledTableHeadCell>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.iban}</TableCell>
                <TableCell>{row.category ? row.category.code : ""}</TableCell>
                <TableCell>{row.category ? row.category.description : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
      component="div"
      page={currentPageNumber}
      onPageChange={(event, newPage) => setCurrentPageNumber(newPage)}
      rowsPerPage={itemsPerPage}
      onRowsPerPageChange={(event) => {
        setCurrentPageNumber(0);
        setItemsPerPage(parseInt(event.target.value, 10));
    }}
      count={totalItems} 
     />
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));

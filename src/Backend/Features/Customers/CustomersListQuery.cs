using System.Xml.Serialization;

namespace Backend.Features.Customers;

public class CustomersListQuery : IRequest<CustomersListQueryResponseWithTotalCount>
{
    public int CurrentPageNumber { get; set; }
    public int ItemsPerPage { get; set; }
    
    public string? Name { get; set; }
    public string? Email { get; set; }
}


public class CustomersListQueryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Iban { get; set; } = "";
    public CustomersListQueryResponseCategory? Category { get; set; }
}




public class CustomersListQueryResponseCategory
{
    public string Code { get; set; } = "";
    public string Description { get; set; } = "";
}

public class CustomersListQueryResponseWithTotalCount
{
    public List<CustomersListQueryResponse> Customers { get; set; } = new();
    public int TotalCount { get; set; }
}


internal class CustomersListQueryHandler(BackendContext context) : IRequestHandler<CustomersListQuery, CustomersListQueryResponseWithTotalCount>
{
    private readonly BackendContext context = context;

    public async Task<CustomersListQueryResponseWithTotalCount> Handle(CustomersListQuery request, CancellationToken cancellationToken)
    {


        //Miglioramento che consente di evitare di effettuare n query sulla tabella CustomerCategory, per ciascun customer recuperato
        var query = context.Customers.Include(c=> c.CustomerCategory).AsQueryable();
        if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(q => q.Name.ToLower().Contains(request.Name.ToLower()));
        if (!string.IsNullOrEmpty(request.Email))
            query = query.Where(q => q.Email.ToLower().Contains(request.Email.ToLower()));


        var total = await query.CountAsync(cancellationToken);

        var data = await query.OrderBy(q => q.Name).ThenBy(q => q.Id)
                        .Skip((request.CurrentPageNumber - 1) * request.ItemsPerPage)
                        .Take(request.ItemsPerPage)
                        .ToListAsync(cancellationToken);

        var result = new CustomersListQueryResponseWithTotalCount();

        var itemList = data.Select(item => new CustomersListQueryResponse
        {
            Id = item.Id,
            Name = item.Name,
            Address = item.Address,
            Email = item.Email,
            Phone = item.Phone,
            Iban = item.Iban,
            Category = item.CustomerCategory == null ? null : new CustomersListQueryResponseCategory
            {
                Code = item.CustomerCategory.Code,
                Description = item.CustomerCategory.Description
            }
        }).ToList();

        result = new CustomersListQueryResponseWithTotalCount()
        {
            Customers = itemList,
            TotalCount = total
        };

        return result;
    }
}
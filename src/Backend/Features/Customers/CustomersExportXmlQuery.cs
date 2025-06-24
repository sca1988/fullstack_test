using System.Xml.Serialization;

namespace Backend.Features.Customers;

public class CustomersExportXmlQuery : IRequest<byte[]>
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}



[XmlRoot("Customers")]
public class CustomersWrapper
{
    [XmlElement("Customer")]
    public List<CustomersListQueryResponse> Customers { get; set; }
}



internal class CustomersExportXmlQueryHandler(BackendContext context) : IRequestHandler<CustomersExportXmlQuery, byte[]>
{
    private readonly BackendContext context = context;

    public async Task<byte[]> Handle(CustomersExportXmlQuery request, CancellationToken cancellationToken)
    {
        //Miglioramento che consente di evitare di effettuare n query sulla tabella CustomerCategory, per ciascun customer recuperato
        var query = context.Customers.Include(c => c.CustomerCategory).AsQueryable();
        if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(q => q.Name.ToLower().Contains(request.Name.ToLower()));
        if (!string.IsNullOrEmpty(request.Email))
            query = query.Where(q => q.Email.ToLower().Contains(request.Email.ToLower()));

        var data = await query.OrderBy(q => q.Name).ThenBy(q => q.Id)
                        .ToListAsync(cancellationToken);


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


        var xmlWrapper = new CustomersWrapper { Customers = itemList };


        var xmlSerializer = new System.Xml.Serialization.XmlSerializer(typeof(CustomersWrapper));
        using var memoryStream = new MemoryStream();
        using (var writer = new StreamWriter(memoryStream))
        {
            xmlSerializer.Serialize(writer, xmlWrapper);
            writer.Flush();
            return memoryStream.ToArray();
        }
    }
}
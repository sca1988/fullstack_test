using System.Threading.Channels;
using Backend.Features.Customers;
using Backend.Features.Employees;
using Backend.Features.Suppliers;

namespace Backend;

static class RouteRegistrationExtensions
{
    public static void UseApiRoutes(this WebApplication app)
    {
        var apiGroup = app.MapGroup("api");

        apiGroup.MapGet("suppliers/list", async ([AsParameters] SupplierListQuery query, IMediator mediator) => await mediator.Send(query))
                    .WithName("GetSuppliersList")
                    .AddOpenApiOperationTransformer((operation, ctx, ct) =>
                    {
                        operation.Summary = "Suppliers List";
                        operation.Description = "Return Suppliers List";
                        return Task.CompletedTask;
                    });

        apiGroup.MapGet("employees/list", async ([AsParameters] EmployeesListQuery query, IMediator mediator) => await mediator.Send(query))
                    .WithName("GetEmployeesList")
                     .AddOpenApiOperationTransformer((operation, ctx, ct) =>
                    {
                        operation.Summary = "Employees List";
                        operation.Description = "Return Employees List";
                        return Task.CompletedTask;
                    });


        apiGroup.MapGet("customers/list", async ([AsParameters] CustomersListQuery query, IMediator mediator) => await mediator.Send(query))
            .WithName("GetCustomerList")
            .AddOpenApiOperationTransformer((operation, ctx, ct) =>
            {
                operation.Summary = "Customer List";
                operation.Description = "Return Customer List";
                return Task.CompletedTask;
            });

        apiGroup.MapGet("customers/xmlexport", async ([AsParameters] CustomersExportXmlQuery query, IMediator mediator, HttpContext httpContext) =>
        {

            var xmlBytes = await mediator.Send(query);

            httpContext.Response.ContentType = "application/xml";
            httpContext.Response.Headers.Append("Content-Disposition", "attachment; filename=customers.xml");
            await httpContext.Response.BodyWriter.WriteAsync(xmlBytes);

        }

         )
            .WithName("ExportCustomersToXml")
            .AddOpenApiOperationTransformer((operation, ctx, ct) =>
        {
            operation.Summary = "Export Customers to XML file";
            operation.Description = "Return xml file with customers data.";
            return Task.CompletedTask;
        });

        apiGroup.MapGet("customers/realtime", (
            ChannelReader<Customer> channelReader,
            CancellationToken cancellationToken) =>
        {
            // 1. ReadAllAsync returns an IAsyncEnumerable
            // 2. Results.ServerSentEvents tells the browser: "Keep this connection open"
            // 3. New data is pushed to the client as soon as it enters the channel
            return Results.ServerSentEvents(
                channelReader.ReadAllAsync(cancellationToken),
                eventType: "customers");
        }).RequireCors("SseCors");

        

        apiGroup.MapPost("customers/pushInChannel", async (
            ChannelWriter<Customer> channelWriter,
            CancellationToken cancellationToken) =>
        {
            var faker = new Faker("it");
            await channelWriter.WriteAsync(new Customer
            {
                Name = faker.Company.CompanyName(),
                Address = faker.Address.FullAddress(),
                Email = faker.Internet.Email(),
                Phone = faker.Phone.PhoneNumber(),
                Iban = faker.Finance.Iban(),
                //CustomerCategoryId = faker.PickRandom(CustomerCategoryIdList),
            });

            return Results.Ok();
        });

    }
}

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
                    .WithOpenApi();

        apiGroup.MapGet("employees/list", async ([AsParameters] EmployeesListQuery query, IMediator mediator) => await mediator.Send(query))
                    .WithName("GetEmployeesList")
                    .WithOpenApi();

        apiGroup.MapGet("customers/list", async ([AsParameters] CustomersListQuery query, IMediator mediator) => await mediator.Send(query))
            .WithName("GetCustomerList")
            .WithOpenApi();
        
        apiGroup.MapGet("customers/xmlexport", async ([AsParameters] CustomersExportXmlQuery query, IMediator mediator, HttpContext httpContext) =>
        {
            
var xmlBytes = await mediator.Send(query);

    httpContext.Response.ContentType = "application/xml";
    httpContext.Response.Headers.Append("Content-Disposition", "attachment; filename=customers.xml");
    await httpContext.Response.BodyWriter.WriteAsync(xmlBytes);

        }
        
         )
            .WithName("ExportCustomersToXml")
            .WithOpenApi();
    }
}

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM microsoft/dotnet:2.2-aspnetcore-runtime-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.2-sdk-nanoserver-1809 AS build
WORKDIR /src
COPY ["Spinner.Web/Spinner.Web.csproj", "Spinner.Web/"]
RUN dotnet restore "Spinner.Web/Spinner.Web.csproj"
COPY . .
WORKDIR "/src/Spinner.Web"
RUN dotnet build "Spinner.Web.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "Spinner.Web.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Spinner.Web.dll"]
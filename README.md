# viu-types


### Outline for new types to be introduced
```
geojson_objects {
    id: uuid
    properties: {}
    geometry
}

company {
    id: uuid;
    name: string;
    contacts: {
        name: string,
        email?: string,
        phone?: string,
        title?: string,
    }[];
    description?: string;
    url?: url;
    logo?: url;
}

floors {
    id: uuid,
    location_id: uuid;
    level: number;
    level_label?: string;
    floor_plan?: url | string | uuid ???;
}

unit {
    id: uuid;
    floor_id: uuid
    object_id?: number;
    label: string;
    services: uuid[];

    tenant: { // ResidentialTenant | CommercialTenant
        CommercialTenant = company struct;
        ResidentialTenant = ApiTenant;        
    }[],
}

service: {
    id: uuid;
    name: string;
    type: string; // FIXME: enumerate
    areas: uuid[]
    resources: {
       name: string,
       booking_ref?: {
           connector_id: uuid,
           source_id: <resource_source_id>
       }
    }[];
    location_id?: uuid;
    floor_id?: uuid;
    description?: string;
    equipment: string[];
    photo?: string; // bucket ref    name: string;
}

area {
    id: uuid
    name: string;
}

If possible API should expose a route that redirects a user to the booking page for a specific service resource

    /services/:id/resources/:connector_id/:source_id ??
```

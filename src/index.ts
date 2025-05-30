import z from 'zod';
import * as GeoJSON from './geojson';
export * as GeoJSON from './geojson';

const auth0UserIdRegex = /^auth0\|[a-f0-9]{24}$/;

export const ApiTagTypeModel = z.enum(['nametag', 'bookingtag']);
export type ApiTagType = z.infer<typeof ApiTagTypeModel>;

export const ApiTagBaseModel = z.object({
  id: z.string(),
  type: ApiTagTypeModel.optional(),
  version: z.string().optional(),
  neomesh_version: z.number().optional(),
  network_id: z.string(),
  organization_id: z.string(),
  last_gateway_id: z.string(),
  last_heartbeat_at: z.string().datetime({ offset: true }),
  scan_action: z.boolean().optional(),
  is_installed: z.boolean().optional(),
  hash: z.string().optional(),
});
export type ApiTagBase = z.infer<typeof ApiTagBaseModel>;

export const ApiNameTagModel = ApiTagBaseModel.extend({
  type: z.literal('nametag'),
  location_id: z.string().uuid(),
  placement: z.string().optional(),
  unit: z.string(),
  tenants: z.array(z.string()),
  street: z.string(),
});
export type ApiNameTag = z.infer<typeof ApiNameTagModel>;

export const ApiNameTagInstallationRequestModel = z.object({
  location_id: z.string().uuid(),
  placement: z.string(),
  unit: z.string(),
});
export type ApiNameTagInstallationRequest = z.infer<
  typeof ApiNameTagInstallationRequestModel
>;

export const ApiConnectorDriverTypeModel = z.enum([
  'wip',
  'bokamera',
  'google-calendar',
  'microsoft-personal',
  'microsoft-resource',
]);
export type ApiConnectorDriverType = z.infer<
  typeof ApiConnectorDriverTypeModel
>;

export const ApiBookingTagEventModel = z.object({
  from: z.string().datetime({ offset: true }),
  to: z.string().datetime({ offset: true }),
  contact_primary: z.string(),
  contact_secondary: z.string().optional(),
  contact_tertiary: z.string().optional(),
});
export type ApiBookingTagEvent = z.infer<typeof ApiBookingTagEventModel>;

export const ApiBookingTagNextSlotBaseModel = z.object({
  from: z.string().datetime({ offset: true }),
});

export const ApiBookingTagNextSlotFreeModel =
  ApiBookingTagNextSlotBaseModel.extend({
    type: z.literal('free'),
    from: z.string().datetime({ offset: true }),
  });
export type ApiBookingTagNextSlotFree = z.infer<
  typeof ApiBookingTagNextSlotFreeModel
>;

export const ApiBookingTagNextSlotEventModel =
  ApiBookingTagNextSlotBaseModel.extend({
    type: z.literal('event'),
    from: z.string().datetime({ offset: true }),
    to: z.string().datetime({ offset: true }),
  });
export type ApiBookingTagNextSlotEvent = z.infer<
  typeof ApiBookingTagNextSlotEventModel
>;

export const ApiBookingTagNextSlotModel = z.discriminatedUnion('type', [
  ApiBookingTagNextSlotFreeModel,
  ApiBookingTagNextSlotEventModel,
]);
export type ApiBookingTagNextSlot = z.infer<typeof ApiBookingTagNextSlotModel>;

export const ApiBookingTagTimelineModel = z.object({
  bitmask: z.string(),
  current_from_index: z.number().optional(),
  current_to_index: z.number().optional(),
});
export type ApiBookingTagTimeline = z.infer<typeof ApiBookingTagTimelineModel>;

export const ApiBookingTagModel = ApiTagBaseModel.extend({
  type: z.literal('bookingtag'),
  connector_id: z.string().optional(),
  location_id: z.string().uuid().optional(),
  resource_id: z.string().optional(),
  resource_source_id: z.string().optional(),
  resource_name: z.string().optional(),
  current_date: z.string().optional(),
  current_event: ApiBookingTagEventModel.optional(),
  next_slot: ApiBookingTagNextSlotModel.optional(),
  timeline: ApiBookingTagTimelineModel.optional(),
});

export type ApiBookingTag = z.infer<typeof ApiBookingTagModel>;

export const ApiBookingTagInstallationRequestModel = z.object({
  connector_id: z.string().uuid(),
  location_id: z.string().uuid().optional(),
  resource_source_id: z.string(),
  resource_name: z.string(),
});

export type ApiBookingTagInstallationRequest = z.infer<
  typeof ApiBookingTagInstallationRequestModel
>;

export const ApiTagModel = z.discriminatedUnion('type', [
  ApiNameTagModel,
  ApiBookingTagModel,
]);
export type ApiTag = z.infer<typeof ApiTagModel>;

export const ApiAddressModel = z.object({
  street: z.string().describe('Street address'),
  zipcode: z.string(),
  city: z.string(),
});
export type ApiAddress = z.infer<typeof ApiAddressModel>;

export const ApiAnnouncementLinkedEventDataModel = z.object({
  announcement_id: z.string(),
});
export type ApiAnnouncementLinkedEventData = z.infer<
  typeof ApiAnnouncementLinkedEventDataModel
>;

export const ApiAnnouncementUnlinkedEventModel = z.object({
  type: z.literal('announcement_unlinked'),
  data: ApiAnnouncementLinkedEventDataModel,
});
export type ApiAnnouncementUnlinkedEvent = z.infer<
  typeof ApiAnnouncementUnlinkedEventModel
>;

export const ApiAnnouncementLinkedEventModel = z.object({
  type: z.literal('announcement_linked'),
  data: ApiAnnouncementLinkedEventDataModel,
});
export type ApiAnnouncementLinkedEvent = z.infer<
  typeof ApiAnnouncementLinkedEventModel
>;

export const ApiMetadataModel = z.object({
  created_at: z.string().datetime({ offset: true }),
  created_by: z.string().regex(auth0UserIdRegex).describe('Auth0 User ID'),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).optional(),
  deleted_by: z
    .string()
    .regex(auth0UserIdRegex)
    .optional()
    .describe('Auth0 User ID'),
});
export type ApiMetadata = z.infer<typeof ApiMetadataModel>;

export const ApiUuidEntityModel = z.object({
  id: z.string().uuid(),
  meta: ApiMetadataModel,
  organization_id: z.string(),
});
export type ApiUuidEntity = z.infer<typeof ApiUuidEntityModel>;

export type ApiAnnouncementRequest = {
  message: string;
  location_ids: Array<string>;
  active_from?: string;
  active_to?: string;
};
export const ApiAnnouncementRequestModel = z.object({
  message: z.string(),
  location_ids: z.string().uuid().array(),
  active_from: z.string().datetime({ offset: true }).optional(),
  active_to: z.string().datetime({ offset: true }).optional(),
});

export const ApiAnnouncementModel = ApiUuidEntityModel.merge(
  ApiAnnouncementRequestModel,
);
export type ApiAnnouncement = z.infer<typeof ApiAnnouncementModel>;

export const ApiCompanyContactModel = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9 -]+$/)
    .optional(),
  title: z.string().optional(),
});
export type ApiCompanyContact = z.infer<typeof ApiCompanyContactModel>;

export const ApiCompanyModel = z.object({
  name: z.string(),
  description: z.string().optional(),
  contacts: z.array(ApiCompanyContactModel),
  url: z.string().url().optional(),
  logo: z.string().url().optional(),
});

export type ApiCompany = z.infer<typeof ApiCompanyModel>;

export const ApiTenantBaseModel = z.object({
  id: z.string().uuid(),
  active_from: z.string().datetime({ offset: true }).optional(),
  active_to: z.string().datetime({ offset: true }).optional(),
});

export const ApiResidentialTenantModel = ApiTenantBaseModel.extend({
  type: z.literal('individual'),
  individual: z.object({
    first_name: z.string(),
    last_name: z.string().optional(),
  }),
});
export type ApiResidentialTenant = z.infer<typeof ApiResidentialTenantModel>;

export const ApiCompanyTenantModel = ApiTenantBaseModel.extend({
  type: z.literal('company'),
  company: ApiCompanyModel,
});
export type ApiCompanyTenant = z.infer<typeof ApiCompanyTenantModel>;

export const ApiTenantModel = z.discriminatedUnion('type', [
  ApiResidentialTenantModel,
  ApiCompanyTenantModel,
]);

export type ApiTenant = z.infer<typeof ApiTenantModel>;

export const ApiOldTenantModel = ApiTenantBaseModel.extend({
  first_name: z.string(),
  last_name: z.string().optional(),
});
export type ApiOldTenant = z.infer<typeof ApiOldTenantModel>;

export const ApiPublicUnitModel = z.object({
  object_id: z.string(),
});
export type ApiPublicUnit = z.infer<typeof ApiPublicUnitModel>;

export const ApiApartmentRequestModel = z.object({
  location_id: z.string().uuid(),
  unit: z.string(),
  floor: z.number(),
  tenants: ApiOldTenantModel.array(),
  source_id: z.string().optional(),
});
export type ApiApartmentRequest = z.infer<typeof ApiApartmentRequestModel>;

export const ApiSyncUnitsRequestModel = z.object({
  organization_id: z.string(),
  unit_ids: z.array(z.string().uuid()),
});
export type ApiSyncUnitsRequest = z.infer<typeof ApiSyncUnitsRequestModel>;

export const ApiApartmentCreatedEventModel = z.object({
  type: z.literal('apartment_created'),
  data: ApiApartmentRequestModel,
});
export type ApiApartmentCreatedEvent = z.infer<
  typeof ApiApartmentCreatedEventModel
>;

export const ApiApartmentModel = ApiUuidEntityModel.merge(
  ApiApartmentRequestModel,
);
export type ApiApartment = z.infer<typeof ApiApartmentModel>;

export const ApiApartmentUpdatedEventModel = z.object({
  type: z.literal('apartment_updated'),
  data: ApiApartmentRequestModel,
});
export type ApiApartmentUpdatedEvent = z.infer<
  typeof ApiApartmentUpdatedEventModel
>;

export const ApiAttachmentCategories = [
  'energy-declaration-ovk',
  'property-info',
  'restaurant-menu',
  'other',
] as const;

export const ApiAttachmentCategoryModel = z.enum(ApiAttachmentCategories);
export type ApiAttachmentCategory = z.infer<typeof ApiAttachmentCategoryModel>;

export const ApiAttachmentLinkEventDataModel = z.object({
  attachment_id: z.string().uuid(),
});
export type ApiAttachmentLinkEventData = z.infer<
  typeof ApiAttachmentLinkEventDataModel
>;

export const ApiAttachmentLinkedEventModel = z.object({
  type: z.literal('attachment_linked'),
  data: ApiAttachmentLinkEventDataModel,
});
export type ApiAttachmentLinkedEvent = z.infer<
  typeof ApiAttachmentLinkedEventModel
>;

export const ApiAttachmentUploadMetadataModel = z.object({
  category: ApiAttachmentCategoryModel,
  active_from: z.string().datetime({ offset: true }).optional(),
  active_to: z.string().datetime({ offset: true }).optional(),
});
export type ApiAttachmentUploadMetadata = z.infer<
  typeof ApiAttachmentUploadMetadataModel
>;

export const ApiAttachmentPatchRequestModel =
  ApiAttachmentUploadMetadataModel.merge(
    z.object({
      name: z.string(),
      location_ids: z.string().uuid().array(),
    }),
  );
export type ApiAttachmentPatchRequest = z.infer<
  typeof ApiAttachmentPatchRequestModel
>;

export const ApiAttachmentRequestModel = ApiAttachmentPatchRequestModel.merge(
  z.object({
    content_hash: z.string(),
    mime_type: z.string(),
  }),
);
export type ApiAttachmentRequest = z.infer<typeof ApiAttachmentRequestModel>;

export const ApiAttachmentModel = ApiUuidEntityModel.merge(
  ApiAttachmentRequestModel,
);
export type ApiAttachment = z.infer<typeof ApiAttachmentModel>;

export const ApiAttachmentUnlinkedEventModel = z.object({
  type: z.literal('attachment_unlinked'),
  data: ApiAttachmentLinkEventDataModel,
});
export type ApiAttachmentUnlinkedEvent = z.infer<
  typeof ApiAttachmentUnlinkedEventModel
>;

export const ApiCoordinateModel = z.object({
  crs: z.enum(['WGS84', 'EPSG:3021']),
  x: z.number(),
  y: z.number(),
});
export type ApiCoordinate = z.infer<typeof ApiCoordinateModel>;

export const ApiDeviceConfigModel = z.record(z.string(), z.any());
export type ApiDeviceConfig = z.infer<typeof ApiDeviceConfigModel>;

export const ApiPublicDeviceConfigModel = z.object({
  organization_id: z.string(),
  config: ApiDeviceConfigModel,
});
export type ApiPublicDeviceConfig = z.infer<typeof ApiPublicDeviceConfigModel>;

export const ApiDeviceCreationEventModel = z.object({
  type: z.literal('creation'),
});
export type ApiDeviceCreationEvent = z.infer<
  typeof ApiDeviceCreationEventModel
>;

export const ApiDeviceTypeModel = z.enum(['eloview', 'gateway']);
export type ApiDeviceType = z.infer<typeof ApiDeviceTypeModel>;

export const ApiDeviceStateModel = z.enum(['created', 'installed']);
export type ApiDeviceState = z.infer<typeof ApiDeviceStateModel>;

export const ApiDeviceRequestModel = z.object({
  location_id: z.string().uuid().optional(),
  placement: z.string().optional(),
  config: ApiDeviceConfigModel,
});
export type ApiDeviceRequest = z.infer<typeof ApiDeviceRequestModel>;

export const ApiDeviceCreationRequestModel = z
  .object({
    name: z.string().describe('Name of the device'),
    hardware_id: z.string(),
    source_id: z.string().describe("Provider's ID for this device"),
    organization_id: z.string(),
    type: ApiDeviceTypeModel,
    state: ApiDeviceStateModel,
  })
  .merge(ApiDeviceRequestModel);
export type ApiDeviceCreationRequest = z.infer<
  typeof ApiDeviceCreationRequestModel
>;

export const ApiDeviceDBRequestModel = z
  .object({
    license_expiry: z.string().datetime({ offset: true }),
    warranty_expiry: z.string().datetime({ offset: true }),
    license_expiry_petition: z.string().datetime({ offset: true }).optional(),
    pre_exchange: z.boolean(),
  })
  .merge(ApiDeviceCreationRequestModel);
export type ApiDeviceDBRequest = z.infer<typeof ApiDeviceDBRequestModel>;

export const ApiDeviceUpdateLicenseExpiryRequestModel = z.object({
  id: z.string(),
  license_expiry: z.string().datetime({ offset: true }),
  organization_id: z.string(),
});
export type ApiDeviceUpdateLicenseExpiryRequest = z.infer<
  typeof ApiDeviceUpdateLicenseExpiryRequestModel
>;

export const ApiDeviceLicenseExpiryPetitionRequestModel = z.object({
  id: z.string(),
  license_expiry_petition: z.string().datetime({ offset: true }).optional(),
  organization_id: z.string(),
});
export type ApiDeviceLicenseExpiryPetitionRequest = z.infer<
  typeof ApiDeviceLicenseExpiryPetitionRequestModel
>;

export const ApiDeviceWarrantyExpiryRequestModel = z.object({
  id: z.string(),
  warranty_expiry: z.string().datetime({ offset: true }),
  organization_id: z.string(),
});

export type ApiDeviceWarrantyExpiryRequest = z.infer<
  typeof ApiDeviceWarrantyExpiryRequestModel
>;

export const ApiDevicePreExchangeRequestModel = z.object({
  id: z.string(),
  pre_exchange: z.boolean(),
  organization_id: z.string(),
});

export type ApiDevicePreExchangeRequest = z.infer<
  typeof ApiDevicePreExchangeRequestModel
>;

export const ApiDeviceEventQueryParamsModel = z.object({
  id: z.string().optional().describe('DeviceEvent ID'),
  device_id: z
    .string()
    .optional()
    .describe('Device for which to retrieve events'),
  organization_id: z
    .string()
    .optional()
    .describe('Organization for which to retrieve events'),
  date_start: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe('Start of time range for which to retrieve events'),
  date_end: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe('End of time range for which to retrieve events'),
  offset: z
    .number()
    .optional()
    .describe(
      'Offset into query results to start returning from. No more than 1000 items will be returned per request.',
    ),
});
export type ApiDeviceEventQueryParams = z.infer<
  typeof ApiDeviceEventQueryParamsModel
>;

export const ApiDeviceRebootEventModel = z.object({
  type: z.literal('reboot'),
});
export type ApiDeviceRebootEvent = z.infer<typeof ApiDeviceRebootEventModel>;

export const ApiDeviceStatusChangeEventDataModel = z.object({
  online: z.boolean(),
});
export type ApiDeviceStatusChangeEventData = z.infer<
  typeof ApiDeviceStatusChangeEventDataModel
>;

export const ApiDeviceSoftwareStatusChangeEventModel = z.object({
  type: z.literal('status-change-software'),
  data: ApiDeviceStatusChangeEventDataModel,
});
export type ApiDeviceSoftwareStatusChangeEvent = z.infer<
  typeof ApiDeviceSoftwareStatusChangeEventModel
>;

export const ApiDeviceHardwareStatusChangeEventModel = z.object({
  type: z.literal('status-change-hardware'),
  data: ApiDeviceStatusChangeEventDataModel,
});
export type ApiDeviceHardwareStatusChangeEvent = z.infer<
  typeof ApiDeviceHardwareStatusChangeEventModel
>;

export const ApiLocationRequestModel = ApiAddressModel.merge(
  z.object({
    site_name: z.string().optional(),
    coordinate: ApiCoordinateModel.optional(),
    config: ApiDeviceConfigModel,
  }),
);
export type ApiLocationRequest = z.infer<typeof ApiLocationRequestModel>;

export const ApiLocationDBRequestModel = ApiLocationRequestModel.merge(
  z.object({
    source_id: z.string().optional(),
  }),
);
export type ApiLocationDBRequest = z.infer<typeof ApiLocationDBRequestModel>;

export const ApiLocationModel = ApiUuidEntityModel.merge(
  ApiLocationDBRequestModel,
);
export type ApiLocation = z.infer<typeof ApiLocationModel>;

export const ApiDeviceInstallationEventDataModel = z.object({
  location: ApiLocationModel,
});
export type ApiDeviceInstallationEventData = z.infer<
  typeof ApiDeviceInstallationEventDataModel
>;

export const ApiDeviceInstallationEventModel = z.object({
  type: z.literal('installation'),
  data: ApiDeviceInstallationEventDataModel,
});
export type ApiDeviceInstallationEvent = z.infer<
  typeof ApiDeviceInstallationEventModel
>;

export const ApiDeviceUninstallEventModel = z.object({
  type: z.literal('uninstall'),
});
export type ApiDeviceUninstallEvent = z.infer<
  typeof ApiDeviceUninstallEventModel
>;

export const ApiDeviceFactoryResetEventModel = z.object({
  type: z.literal('factory-reset'),
});
export type ApiDeviceFactoryResetEvent = z.infer<
  typeof ApiDeviceFactoryResetEventModel
>;

export const ApiDeviceEventRequestModel = z
  .object({
    device_id: z.string(),
  })
  .and(
    z.discriminatedUnion('type', [
      ApiDeviceRebootEventModel,
      ApiDeviceSoftwareStatusChangeEventModel,
      ApiDeviceHardwareStatusChangeEventModel,
      ApiDeviceCreationEventModel,
      ApiDeviceInstallationEventModel,
      ApiDeviceUninstallEventModel,
      ApiDeviceFactoryResetEventModel,
    ]),
  );
export type ApiDeviceEventRequest = z.infer<typeof ApiDeviceEventRequestModel>;

export const ApiStringEntityModel = z.object({
  id: z.string(),
  meta: ApiMetadataModel,
  organization_id: z.string(),
});
export type ApiStringEntity = z.infer<typeof ApiStringEntityModel>;

export const ApiDeviceEventModel = ApiStringEntityModel.and(
  ApiDeviceEventRequestModel,
).and(
  z.object({
    organization_id: z.string(),
  }),
);
export type ApiDeviceEvent = z.infer<typeof ApiDeviceEventModel>;

export const ApiDeviceInstallationRequestModel = z.object({
  location_id: z.string().uuid(),
  placement: z
    .string()
    .describe(
      'Specific place within the location where the device is installed',
    ),
});
export type ApiDeviceInstallationRequest = z.infer<
  typeof ApiDeviceInstallationRequestModel
>;

export const ApiDeviceStatusModel = z.object({
  hardware_online: z.boolean(),
  software_online: z.boolean(),
  last_seen: z.string().datetime({ offset: true }).optional(),
});
export type ApiDeviceStatus = z.infer<typeof ApiDeviceStatusModel>;

export const ApiDeviceIntegrationConfigIloqResourceFilterSchemaModel = z.object(
  {
    type: z.enum(['whitelist', 'blacklist']),
    resources: z.array(z.string().uuid()),
  },
);
export type ApiDeviceIntegrationConfigIloqResourceFilterSchema = z.infer<
  typeof ApiDeviceIntegrationConfigIloqResourceFilterSchemaModel
>;

export const ApiDeviceIntegrationConfigIloqSchemaModel = z.object({
  lock_group_id: z.string().uuid(),
  resource_filter: ApiDeviceIntegrationConfigIloqResourceFilterSchemaModel,
});
export type ApiDeviceIntegrationConfigIloqSchema = z.infer<
  typeof ApiDeviceIntegrationConfigIloqSchemaModel
>;

export const ApiDeviceIntegrationConfigSchemaModel = z.object({
  iloq: ApiDeviceIntegrationConfigIloqSchemaModel.optional(),
});
export type ApiDeviceIntegrationConfigSchema = z.infer<
  typeof ApiDeviceIntegrationConfigSchemaModel
>;

export const ApiDeviceModel = ApiStringEntityModel.merge(
  ApiDeviceDBRequestModel,
).extend({
  status: ApiDeviceStatusModel,
  integration_config: ApiDeviceIntegrationConfigSchemaModel,
});
export type ApiDevice = z.infer<typeof ApiDeviceModel>;

export const ApiEmbeddedUrlLinkEventDataModel = z.object({
  embedded_url_id: z.string().uuid(),
});
export type ApiEmbeddedUrlLinkEventData = z.infer<
  typeof ApiEmbeddedUrlLinkEventDataModel
>;

export const ApiEmbeddedUrlLinkedEventModel = z.object({
  type: z.literal('embedded_url_linked'),
  data: ApiEmbeddedUrlLinkEventDataModel,
});
export type ApiEmbeddedUrlLinkedEvent = z.infer<
  typeof ApiEmbeddedUrlLinkedEventModel
>;

export const ApiEmbeddedUrlIcons = [
  'info',
  'energy',
  'video',
  'stats',
  'eco',
  'signal',
  'network',
] as const;
export const ApiEmbeddedUrlIconModel = z.enum(ApiEmbeddedUrlIcons);
export type ApiEmbeddedUrlIcon = z.infer<typeof ApiEmbeddedUrlIconModel>;

export const ApiEmbeddedUrlRequestModel = z.object({
  name: z.string(),
  label: z.string(),
  icon: ApiEmbeddedUrlIconModel,
  url: z.string().url(),
  location_ids: z.string().uuid().array(),
  active_from: z.string().datetime({ offset: true }).optional(),
  active_to: z.string().datetime({ offset: true }).optional(),
});
export type ApiEmbeddedUrlRequest = z.infer<typeof ApiEmbeddedUrlRequestModel>;

export const ApiEmbeddedUrlModel = ApiUuidEntityModel.merge(
  ApiEmbeddedUrlRequestModel,
);
export type ApiEmbeddedUrl = z.infer<typeof ApiEmbeddedUrlModel>;

export const ApiEmbeddedUrlUnlinkedEventModel = z.object({
  type: z.literal('embedded_url_unlinked'),
  data: ApiEmbeddedUrlLinkEventDataModel,
});
export type ApiEmbeddedUrlUnlinkedEvent = z.infer<
  typeof ApiEmbeddedUrlUnlinkedEventModel
>;

export const ApiErrorModel = z.object({
  message: z.string().describe('Error message'),
});
export type ApiError = z.infer<typeof ApiErrorModel>;

export const ApiSynchronizedTypeModel = z.enum([
  'announcements',
  'apartments',
  'attachments',
  'embedded-urls',
  'locations',
  'floors',
  'units',
]);
export type ApiSynchronizedType = z.infer<typeof ApiSynchronizedTypeModel>;

export const ApiOrganizationRequestModel = z.object({
  name: z.string(),
  synchronized_types: ApiSynchronizedTypeModel.array(),
  config: ApiDeviceConfigModel,
  license_notification_subscribers: z.array(z.string().email()),
  alert_notification_subscribers: z.array(z.string().email()),
});
export type ApiOrganizationRequest = z.infer<
  typeof ApiOrganizationRequestModel
>;

export const ApiOrganizationModel = ApiOrganizationRequestModel.merge(
  z.object({
    id: z.string(),
    meta: ApiMetadataModel,
  }),
);
export type ApiOrganization = z.infer<typeof ApiOrganizationModel>;

export const ApiOrganizationIntegrationConfigIloqSchemaModel = z.object({
  customer_code: z.string(),
});
export type ApiOrganizationIntegrationConfigIloqSchema = z.infer<
  typeof ApiOrganizationIntegrationConfigIloqSchemaModel
>;

export const ApiOrganizationIntegrationConfigSchemaModel = z.object({
  iloq: ApiOrganizationIntegrationConfigIloqSchemaModel.optional(),
});
export type ApiOrganizationIntegrationConfigSchema = z.infer<
  typeof ApiOrganizationIntegrationConfigSchemaModel
>;

export const ApiOrganizationIntegrationConfigDBRequestModel = z.object({
  organization_id: z.string(),
  config: ApiOrganizationIntegrationConfigSchemaModel,
});
export type ApiOrganizationIntegrationConfigDBRequest = z.infer<
  typeof ApiOrganizationIntegrationConfigDBRequestModel
>;

export const ApiOrganizationIntegrationConfigModel =
  ApiOrganizationIntegrationConfigDBRequestModel.extend({
    meta: ApiMetadataModel,
  });
export type ApiOrganizationIntegrationConfig = z.infer<
  typeof ApiOrganizationIntegrationConfigModel
>;

export const ApiDeviceUpdateLicenseAndWarrantyInfoRequestModel = z.object({
  hardware_id: z.string(),
  license_expiry: z.string(),
  warranty_expiry: z.string(),
  pre_exchange: z.boolean(),
});

export type ApiDeviceUpdateLicenseAndWarrantyInfoRequest = z.infer<
  typeof ApiDeviceUpdateLicenseAndWarrantyInfoRequestModel
>;

const ApiParameterValidationErrorBaseModel = z.object({
  msg: z.string(),
  param: z.string(),
  value: z.string(),
  location: z.enum(['body', 'query', 'params', 'cookies', 'headers']),
});
export type ApiParameterValidationError = z.infer<
  typeof ApiParameterValidationErrorBaseModel
> & {
  nestedErrors?: Array<ApiParameterValidationError>;
};
export const ApiParameterValidationErrorModel: z.ZodType<ApiParameterValidationError> =
  ApiParameterValidationErrorBaseModel.extend({
    nestedErrors: z.lazy(() => ApiParameterValidationErrorModel.array()),
  });

export const ApiPermissionModel = z.enum([
  'announcements:create',
  'announcements:update',
  'announcements:delete',
  'apartments:create',
  'apartments:update',
  'apartments:delete',
  'apartments:sync',
  'areas:edit',
  'attachments:create',
  'attachments:update',
  'attachments:delete',
  'devices:create',
  'devices:update',
  'devices:delete',
  'devices:factory-reset',
  'devices:uninstall',
  'features:edit',
  'floors:edit',
  'tags:uninstall',
  'embedded-urls:create',
  'embedded-urls:update',
  'embedded-urls:delete',
  'locations:create',
  'locations:update',
  'locations:delete',
  'services:edit',
  'units:edit',
  'units:sync',
  'users:read-all',
  'organizations:update',
  'licenses:update',
]);
export type ApiPermission = z.infer<typeof ApiPermissionModel>;

export const ApiProfileModel = z.record(z.string(), z.any());
export type ApiProfile = z.infer<typeof ApiProfileModel>;

export const ApiUserModel = z.object({
  id: z.string().regex(auth0UserIdRegex).describe('Auth0 User ID'),
  meta: ApiMetadataModel,
  name: z.string(),
  email: z.string().email(),
});
export type ApiUser = z.infer<typeof ApiUserModel>;

export const UserModel = z.object({
  uid: z.string(),
  organization: z.string(),
  permissions: ApiPermissionModel.array(),
});
export type User = z.infer<typeof UserModel>;

export const ApiValidationErrorModel = ApiErrorModel.extend({
  errors: ApiParameterValidationErrorModel.array(),
});
export type ApiValidationError = z.infer<typeof ApiValidationErrorModel>;

export const DbSchedulerLastRunModel = z.object({
  hash: z.string(),
  last_run: z.date(),
});
export type DbSchedulerLastRun = z.infer<typeof DbSchedulerLastRunModel>;
export const ApiResultModel = z.object({
  result: z.boolean(),
});
export type ApiResult = z.infer<typeof ApiResultModel>;

export const ApiGoogleCalendarTokenRequestModel = z.object({
  username: z.string(),
  organization_id: z.string(),
  refresh_token: z.string(),
  access_token: z.string(),
});
export type ApiGoogleCalendarTokenRequest = z.infer<
  typeof ApiGoogleCalendarTokenRequestModel
>;

export const ApiGoogleCalendarTokenModel =
  ApiGoogleCalendarTokenRequestModel.extend({
    meta: ApiMetadataModel,
  });
export type ApiGoogleCalendarToken = z.infer<
  typeof ApiGoogleCalendarTokenModel
>;

export const ApiGoogleCalendarTokenAuthCodeRequestModel = z.object({
  tag_id: z.string(),
  auth_code: z.string(),
});
export type ApiGoogleCalendarTokenAuthCodeRequest = z.infer<
  typeof ApiGoogleCalendarTokenAuthCodeRequestModel
>;

export const ApiBookingTagResourceModel = z.object({
  resource_source_id: z.string(),
  name: z.string(),
});
export type ApiBookingTagResource = z.infer<typeof ApiBookingTagResourceModel>;

export const ApiConnectorBaseModel = z.object({
  id: z.string().uuid(),
  organization_id: z.string(),
  meta: ApiMetadataModel,
  name: z.string(),
  config: z.unknown(),
});
export type ApiConnectorBase = z.infer<typeof ApiConnectorBaseModel>;

export const ApiConnectorBookingConfigModel = z.object({
  booking_url: z.string().optional(),
});
export type ApiConnectorBookingConfig = z.infer<
  typeof ApiConnectorBookingConfigModel
>;

export const ApiConnectorWipConfigModel = ApiConnectorBookingConfigModel.extend(
  { calendar_base_url: z.string() },
);
export type ApiConnectorWipConfig = z.infer<typeof ApiConnectorWipConfigModel>;

export const ApiConnectorWipModel = ApiConnectorBaseModel.extend({
  driver_type: z.literal('wip'),
  config: ApiConnectorWipConfigModel,
});
export type ApiConnectorWip = z.infer<typeof ApiConnectorWipModel>;

export const ApiConnectorGoogleCalendarConfigModel =
  ApiConnectorBookingConfigModel.extend({
    private_key: z.string(),
    client_email: z.string(),
    customer_id: z.string(),
  });
export type ApiConnectorGoogleCalendarConfig = z.infer<
  typeof ApiConnectorGoogleCalendarConfigModel
>;

export const ApiConnectorGoogleCalendarModel = ApiConnectorBaseModel.extend({
  driver_type: z.literal('google-calendar'),
  config: ApiConnectorGoogleCalendarConfigModel,
});
export type ApiConnectorGoogleCalendar = z.infer<
  typeof ApiConnectorGoogleCalendarModel
>;

export const ApiConnectorMicrosoftCalendarConfigModel = z.object({
  tenant_id: z.string(),
  client_id: z.string(),
  cert: z.string(),
  private_key: z.string(),
  booking_url: z.string().optional(),
});
export type ApiConnectorMicrosoftCalendarConfig = z.infer<
  typeof ApiConnectorMicrosoftCalendarConfigModel
>;

export const ApiConnectorMicrosoftPersonalModel = ApiConnectorBaseModel.extend({
  driver_type: z.literal('microsoft-personal'),
  config: ApiConnectorMicrosoftCalendarConfigModel,
});
export type ApiConnectorMicrosoftPersonal = z.infer<
  typeof ApiConnectorMicrosoftPersonalModel
>;

export const ApiConnectorMicrosoftResourceModel = ApiConnectorBaseModel.extend({
  driver_type: z.literal('microsoft-resource'),
  config: ApiConnectorMicrosoftCalendarConfigModel,
});
export type ApiConnectorMicrosoftResource = z.infer<
  typeof ApiConnectorMicrosoftResourceModel
>;

export const ApiConnectorBokaMeraConfigModel =
  ApiConnectorBookingConfigModel.extend({
    api_base_url: z.string(),
    api_token_url: z.string(),
    api_key: z.string(),
    client_id: z.string(),
    username: z.string(),
    password: z.string(),
    access_token: z.string().optional(),
    refresh_token: z.string().optional(),
  });
export type ApiBookingConnectorBokaMeraConfig = z.infer<
  typeof ApiConnectorBokaMeraConfigModel
>;

export const ApiConnectorBokaMeraModel = ApiConnectorBaseModel.extend({
  driver_type: z.literal('bokamera'),
  config: ApiConnectorBokaMeraConfigModel,
});
export type ApiBookingConnectorBokaMera = z.infer<
  typeof ApiConnectorBokaMeraModel
>;

export const ApiConnectorModel = z.discriminatedUnion('driver_type', [
  ApiConnectorWipModel,
  ApiConnectorBokaMeraModel,
  ApiConnectorGoogleCalendarModel,
  ApiConnectorMicrosoftPersonalModel,
  ApiConnectorMicrosoftResourceModel,
]);
export type ApiConnector = z.infer<typeof ApiConnectorModel>;

export const ApiPublicConnectorModel = ApiConnectorBaseModel.pick({
  id: true,
  name: true,
}).extend({
  driver_type: ApiConnectorDriverTypeModel,
});
export type ApiPublicConnector = z.infer<typeof ApiPublicConnectorModel>;

export const ApiConnectorRequestModel = ApiConnectorBaseModel.pick({
  id: true,
  organization_id: true,
  name: true,
}).extend({
  driver_type: ApiConnectorDriverTypeModel,
});
export type ApiConnectorRequest = z.infer<typeof ApiConnectorRequestModel>;

export const ApiConnectorWipCreationRequestModel =
  ApiConnectorRequestModel.omit({ id: true, driver_type: true }).extend({
    driver_type: z.literal('wip'),
    config: ApiConnectorWipConfigModel,
  });
export type ApiConnectorWipCreationRequest = z.infer<
  typeof ApiConnectorWipCreationRequestModel
>;

export const ApiConnectorBokaMeraCreationRequestModel =
  ApiConnectorRequestModel.omit({ id: true, driver_type: true }).extend({
    driver_type: z.literal('bokamera'),
    config: ApiConnectorBokaMeraConfigModel,
  });
export type ApiConnectorBokaMeraCreationRequest = z.infer<
  typeof ApiConnectorBokaMeraCreationRequestModel
>;

export const ApiConnectorGoogleCalendarCreationRequestModel =
  ApiConnectorRequestModel.omit({ id: true, driver_type: true }).extend({
    driver_type: z.literal('google-calendar'),
    config: ApiConnectorGoogleCalendarConfigModel,
  });
export type ApiConnectorGoogleCalendarCreationRequest = z.infer<
  typeof ApiConnectorGoogleCalendarCreationRequestModel
>;

export const ApiConnectorMicrosoftPersonalCreationRequestModel =
  ApiConnectorRequestModel.omit({ id: true, driver_type: true }).extend({
    driver_type: z.literal('microsoft-personal'),
    config: ApiConnectorMicrosoftCalendarConfigModel,
  });

export const ApiConnectorMicrosoftResourceCreationRequestModel =
  ApiConnectorRequestModel.omit({ id: true, driver_type: true }).extend({
    driver_type: z.literal('microsoft-resource'),
    config: ApiConnectorMicrosoftCalendarConfigModel,
  });

export const ApiConnectorCreationRequestModel = z.discriminatedUnion(
  'driver_type',
  [
    ApiConnectorWipCreationRequestModel,
    ApiConnectorBokaMeraCreationRequestModel,
    ApiConnectorGoogleCalendarCreationRequestModel,
    ApiConnectorMicrosoftPersonalCreationRequestModel,
    ApiConnectorMicrosoftResourceCreationRequestModel,
  ],
);
export type ApiConnectorCreationRequest = z.infer<
  typeof ApiConnectorCreationRequestModel
>;

export const ApiFeatureRequestPropertiesModel = z.object({
  location_id: z.string().uuid().optional(),
  floor_id: z.string().uuid().optional(),
  unit_id: z.string().uuid().optional(),
  service_ids: z.array(z.string().uuid()).optional(),
  areas: z.array(z.string().uuid()).optional(),
});

export type ApiFeatureRequestProperties = z.infer<
  typeof ApiFeatureRequestPropertiesModel
>;

export const ApiFeatureRequest = GeoJSON.FeatureModel.extend({
  properties: ApiFeatureRequestPropertiesModel,
});
export type ApiFeatureRequest = z.infer<typeof ApiFeatureRequest>;

export const ApiFeaturePropertiesModel =
  ApiFeatureRequestPropertiesModel.extend({
    id: z.string().uuid(),
    organization_id: z.string(),
    meta: ApiMetadataModel,
  });
export type ApiFeatureProperties = z.infer<typeof ApiFeaturePropertiesModel>;

export const ApiFeatureModel = ApiFeatureRequest.extend({
  properties: ApiFeaturePropertiesModel.or(z.null()),
});
export type ApiFeature = z.infer<typeof ApiFeatureModel>;

export const ApiFeatureCollectionModel = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(ApiFeatureModel),
});
export type ApiFeatureCollection = z.infer<typeof ApiFeatureCollectionModel>;

export const ApiFloorUpdateRequestModel = z.object({
  level: z.number(),
  level_label: z.string().optional(),
  floor_plan: z.string().url().optional(),
});
export type ApiFloorUpdateRequest = z.infer<typeof ApiFloorUpdateRequestModel>;

export const ApiFloorRequestModel = ApiFloorUpdateRequestModel.extend({
  location_id: z.string().uuid(),
});
export type ApiFloorRequest = z.infer<typeof ApiFloorRequestModel>;

export const ApiFloorModel = ApiFloorRequestModel.extend({
  id: z.string().uuid(),
  organization_id: z.string(),
  meta: ApiMetadataModel,
});
export type ApiFloor = z.infer<typeof ApiFloorModel>;

export const ApiBookableResourceRefModel = z.object({
  connector_id: z.string().uuid(),
  source_id: z.string(),
});
export type ApiBookableResourceRef = z.infer<
  typeof ApiBookableResourceRefModel
>;

export const ApiUnitUpdateRequestModel = z.object({
  label: z.string().optional(),
  object_id: z.string(),
  tenants: z.array(ApiTenantModel),
});
export type ApiUnitUpdateRequest = z.infer<typeof ApiUnitUpdateRequestModel>;

const ApiUnitRequestModel = ApiUnitUpdateRequestModel.extend({
  location_id: z.string().uuid(),
  floor_id: z.string().uuid(),
});
export type ApiUnitRequest = z.infer<typeof ApiUnitRequestModel>;

const ApiUnitModel = ApiUnitRequestModel.extend({
  id: z.string().uuid(),
  organization_id: z.string(),
  meta: ApiMetadataModel,
});
export type ApiUnit = z.infer<typeof ApiUnitModel>;

export const ApiServiceResourceModel = z.object({
  name: z.string(),
  capacity: z.number().optional(),
  booking_ref: ApiBookableResourceRefModel.optional(),
});
export type ApiServiceResource = z.infer<typeof ApiServiceResourceModel>;

export const ApiServiceRequestModel = z.object({
  type: z.string(),
  name: z.string(),

  areas: z.string().array(),
  resources: z.array(ApiServiceResourceModel),

  location_id: z.string().uuid().optional(),
  floor_id: z.string().uuid().optional(),

  equipment: z.string().array(),
  description: z.string().optional(),
  photo: z.string().url().optional(),
});
export type ApiServiceRequest = z.infer<typeof ApiServiceRequestModel>;

export const ApiServiceModel = ApiServiceRequestModel.extend({
  id: z.string().uuid(),
  organization_id: z.string(),
  meta: ApiMetadataModel,
});
export type ApiService = z.infer<typeof ApiServiceModel>;

export const ApiAreaRequestModel = z.object({
  name: z.string(),
});
export type ApiAreaRequest = z.infer<typeof ApiAreaRequestModel>;

export const ApiArea = ApiAreaRequestModel.extend({
  id: z.string().uuid(),
  organization_id: z.string(),
});
export type ApiArea = z.infer<typeof ApiArea>;

export const ApiLocationCreatedEventModel = z.object({
  type: z.literal('location_created'),
  data: ApiLocationRequestModel,
});
export type ApiLocationCreatedEvent = z.infer<
  typeof ApiLocationCreatedEventModel
>;

export const ApiLocationDeletedEventModel = z.object({
  type: z.literal('location_deleted'),
});
export type ApiLocationDeletedEvent = z.infer<
  typeof ApiLocationDeletedEventModel
>;

export const ApiLocationDeviceEventDataModel = z.object({
  device_id: z.string(),
});
export type ApiLocationDeviceEventData = z.infer<
  typeof ApiLocationDeviceEventDataModel
>;

export const ApiLocationDeviceInstalledEventModel = z.object({
  type: z.literal('device_installed'),
  data: ApiLocationDeviceEventDataModel,
});
export type ApiLocationDeviceInstalledEvent = z.infer<
  typeof ApiLocationDeviceInstalledEventModel
>;

export const ApiLocationDeviceUninstalledEventModel = z.object({
  type: z.literal('device_uninstalled'),
  data: ApiLocationDeviceEventDataModel,
});
export type ApiLocationDeviceUninstalledEvent = z.infer<
  typeof ApiLocationDeviceUninstalledEventModel
>;

export const ApiLocationUpdatedEventModel = z.object({
  type: z.literal('location_updated'),
  data: ApiLocationRequestModel,
});
export type ApiLocationUpdatedEvent = z.infer<
  typeof ApiLocationUpdatedEventModel
>;

export const ApiTenantMovedEventDataModel = z.object({
  name: z.string(),
});
export type ApiTenantMovedEventData = z.infer<
  typeof ApiTenantMovedEventDataModel
>;

export const ApiTenantMovedInEventModel = z.object({
  type: z.literal('tenant_moved_in'),
  data: ApiTenantMovedEventDataModel,
});
export type ApiTenantMovedInEvent = z.infer<typeof ApiTenantMovedInEventModel>;

export const ApiTenantMovedOutEventModel = z.object({
  type: z.literal('tenant_moved_out'),
  data: ApiTenantMovedEventDataModel,
});
export type ApiTenantMovedOutEvent = z.infer<
  typeof ApiTenantMovedOutEventModel
>;

export const ApiFloorCreatedEventModel = z.object({
  type: z.literal('floor_created'),
  data: ApiFloorModel,
});

export const ApiFloorDeletedEventModel = z.object({
  type: z.literal('floor_deleted'),
  data: ApiFloorModel,
});

export const ApiUnitCreatedEventModel = z.object({
  type: z.literal('unit_created'),
  data: ApiUnitModel,
});
export type ApiUnitCreatedEvent = z.infer<typeof ApiUnitCreatedEventModel>;

export const ApiUnitDeletedEventModel = z.object({
  type: z.literal('unit_deleted'),
  data: ApiUnitModel,
});
export type ApiUnitDeletedEvent = z.infer<typeof ApiUnitDeletedEventModel>;

export const ApiServiceCreatedEventModel = z.object({
  type: z.literal('service_created'),
  data: ApiServiceModel,
});
export type ApiServiceCreatedEvent = z.infer<
  typeof ApiServiceCreatedEventModel
>;

export const ApiServiceDeletedEventModel = z.object({
  type: z.literal('service_deleted'),
  data: ApiServiceModel,
});
export type ApiServiceDeletedEvent = z.infer<
  typeof ApiServiceDeletedEventModel
>;

export const ApiLocationEventRequestModel = z
  .object({
    location_id: z.string().uuid(),
  })
  .and(
    z.discriminatedUnion('type', [
      ApiLocationDeviceInstalledEventModel,
      ApiLocationDeviceUninstalledEventModel,
      ApiLocationCreatedEventModel,
      ApiLocationUpdatedEventModel,
      ApiLocationDeletedEventModel,
      ApiApartmentCreatedEventModel,
      ApiApartmentUpdatedEventModel,
      ApiAnnouncementLinkedEventModel,
      ApiAnnouncementUnlinkedEventModel,
      ApiAttachmentLinkedEventModel,
      ApiAttachmentUnlinkedEventModel,
      ApiEmbeddedUrlLinkedEventModel,
      ApiEmbeddedUrlUnlinkedEventModel,
      ApiTenantMovedInEventModel,
      ApiTenantMovedOutEventModel,
      ApiFloorCreatedEventModel,
      ApiFloorDeletedEventModel,
      ApiUnitCreatedEventModel,
      ApiUnitDeletedEventModel,
      ApiServiceCreatedEventModel,
      ApiServiceDeletedEventModel,
    ]),
  );
export type ApiLocationEventRequest = z.infer<
  typeof ApiLocationEventRequestModel
>;

export const ApiLocationEventModel = ApiStringEntityModel.and(
  ApiLocationEventRequestModel,
);
export type ApiLocationEvent = z.infer<typeof ApiLocationEventModel>;

export const ApiImageUploadResponseModel = z.object({
  id: z.string(),
  url: z.string().url(),
});

export type ApiImageUploadResponse = z.infer<
  typeof ApiImageUploadResponseModel
>;

export const ApiIloqResourceModel = z.object({
  resource_id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  info: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  type: z.string().optional(),
  zone_id: z.string().optional(),
  real_estate_id: z.string().optional(),
});
export type ApiIloqResource = z.infer<typeof ApiIloqResourceModel>;

export const ApiIloqBookingSchemaSlotModel = z.object({
  slot_id: z.string(),
  start_time: z.string(), // Ex: "08:00"
  end_time: z.string(), // Ex: "12:00"
  bookable: z.boolean(),
  bookable_by_nfc_id: z.boolean().optional(),
});
export type ApiIloqBookingSchemaSlot = z.infer<
  typeof ApiIloqBookingSchemaSlotModel
>;

export const ApiIloqBookingSchemaDayModel = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  day_of_week: z.number().int().min(1).max(7),
  slots: z.array(ApiIloqBookingSchemaSlotModel),
});
export type ApiIloqBookingSchemaDay = z.infer<
  typeof ApiIloqBookingSchemaDayModel
>;

export const ApiIloqBookingSchemaModel = z.object({
  schema_type: z.string().optional(),
  days: z.array(ApiIloqBookingSchemaDayModel),
});
export type ApiIloqBookingSchema = z.infer<typeof ApiIloqBookingSchemaModel>;

export const ApiIloqBookingModel = z.object({
  booking_id: z.string(),
  resource_id: z.string(),
  key_nfc_id: z.string().optional(),
  name: z.string().nullable().optional(),
  start_time: z.string().datetime({ offset: true }),
  end_time: z.string().datetime({ offset: true }),
  status: z.string().optional(),
  pin: z.string().optional(),
});
export type ApiIloqBooking = z.infer<typeof ApiIloqBookingModel>;

export const ApiIloqCreateBookingRequestModel = z.object({
  resource_id: z.string(),
  key_nfc_id: z.string(),
  start_time: z.string().datetime({ offset: true }),
  end_time: z.string().datetime({ offset: true }),
  subject: z.string().optional(),
});
export type ApiIloqCreateBookingRequest = z.infer<
  typeof ApiIloqCreateBookingRequestModel
>;

export const ApiIloqUserBookingsResponseDataModel = z.object({
  key_nfc_id: z.string(),
  pin: z.string().optional(),
  bookings: z.array(ApiIloqBookingModel),
});
export type ApiIloqUserBookingsResponseData = z.infer<
  typeof ApiIloqUserBookingsResponseDataModel
>;

export const ApiIloqResourceBookingsResponseDataModel = z.object({
  resource_id: z.string(),
  bookings: z.array(ApiIloqBookingModel),
});
export type ApiIloqResourceBookingsResponseData = z.infer<
  typeof ApiIloqResourceBookingsResponseDataModel
>;

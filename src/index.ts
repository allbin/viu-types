import z from 'zod';

export const ApiTagModel = z.object({
  id: z.string(),
  last_gateway_id: z.string(),
  last_heartbeat_at: z.string().datetime(),
});
export type ApiTag = z.infer<typeof ApiTagModel>;

export const ApiNameTagModel = ApiTagModel.extend({
  type: z.literal('nametag'),
  apartment_id: z.string() /* (location_id:unit) */,
});
export type ApiNameTag = z.infer<typeof ApiNameTagModel>;

export const ApiBookingTagCalendarModel = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});
export type ApiBookingTagCalendar = z.infer<typeof ApiBookingTagCalendarModel>;

export const ApiBookingTagModel = ApiTagModel.extend({
  type: z.literal('bookingtag'),
  resource_id: z.string(),
  calendar: z.array(ApiBookingTagCalendarModel),
});
export type ApiBookingTag = z.infer<typeof ApiBookingTagModel>;

export const ApiAddressModel = z.object({
  /**
   * Street address
   */
  street: z.string(),
  zipcode: z.string(),
  city: z.string(),
});
export type ApiAddress = z.infer<typeof ApiAddressModel>;

export const ApiAnnouncementLinkEventDataModel = z.object({
  announcement_id: z.string(),
});
export type ApiAnnouncementLinkEventData = z.infer<
  typeof ApiAnnouncementLinkEventDataModel
>;

export const ApiAnnouncementLinkEventModel = z.object({
  type: z.literal('announcement_linked'),
  data: ApiAnnouncementLinkEventDataModel,
});
export type ApiAnnouncementLinkEvent = z.infer<
  typeof ApiAnnouncementLinkEventModel
>;

type ApiAnnouncementRequest = {
  message: string;
  location_ids: Array<string>;
  active_from?: string;
  active_to?: string;
};

type ApiAnnouncement = ApiUuidEntity & ApiAnnouncementRequest;

type ApiAnnouncementUnlinkedEvent = {
  type: 'announcement_unlinked';
  data: ApiAnnouncementLinkEventData;
};

type ApiApartmentCreatedEvent = {
  type: 'apartment_created';
  data: ApiApartmentRequest;
};

type ApiApartmentRequest = {
  /**
   * References an ApiLocation
   */
  location_id: string;
  /**
   * Unit identifier
   */
  unit: string;
  /**
   * Floor number
   */
  floor: number;
  tenants: Array<ApiTenant>;
  /**
   * Provider's ID for this device
   */
  source_id?: string;
};

type ApiApartment = ApiUuidEntity & ApiApartmentRequest;

type ApiApartmentUpdatedEvent = {
  type: 'apartment_updated';
  data: ApiApartmentRequest;
};

type ApiAttachmentCategory =
  | 'energy-declaration-ovk'
  | 'property-info'
  | 'other';

type ApiAttachmentLinkedEvent = {
  type: 'attachment_linked';
  data: ApiAttachmentLinkEventData;
};

type ApiAttachmentLinkEventData = {
  attachment_id: string;
};

type ApiAttachmentPatchRequest = ApiAttachmentUploadMetadata & {
  /**
   * Displayed file name
   */
  name: string;
  location_ids: Array<string>;
};

type ApiAttachmentRequest = ApiAttachmentPatchRequest & {
  /**
   * SHA256 hash of the file contents. Used as filename in the storage bucket.
   */
  content_hash: string;
  /**
   * MIME-type
   */
  mime_type: string;
};

type ApiAttachment = ApiUuidEntity & ApiAttachmentRequest;

type ApiAttachmentUnlinkedEvent = {
  type: 'attachment_unlinked';
  data: ApiAttachmentLinkEventData;
};

type ApiAttachmentUploadMetadata = {
  category: ApiAttachmentCategory;
  active_from?: string;
  active_to?: string;
};

type ApiCoordinate = {
  /**
   * Coordinate Reference System
   */
  crs: 'WGS84' | 'EPSG:3021';
  /**
   * X-coordinate in CRS
   */
  x: number;
  /**
   * Y-coordinate in CRS
   */
  y: number;
};

type ApiDeviceConfig = Record<string, boolean | number | string>;

type ApiDeviceCreationEvent = {
  type: 'creation';
};

type ApiDeviceDBRequest = {
  /**
   * Name of the device
   */
  name: string;
  hardware_id: string;
  /**
   * Provider's ID for this device
   */
  source_id: string;
  organization_id: string;
  type: ApiDeviceType;
  state: ApiDeviceState;
} & ApiDeviceRequest;

type ApiDeviceEventQueryParams = {
  /**
   * DeviceEvent ID
   */
  id?: string;
  /**
   * Device for which to retrieve events
   */
  device_id?: string;
  /**
   * Organization for which to retrieve events
   */
  organization_id?: string;
  /**
   * Start of time range for which to retrieve events
   */
  date_start?: string;
  /**
   * End of time range for which to retrieve events
   */
  date_end?: string;
  /**
   * Offset into query results to start returning from. No more than 1000 items will be returned per request.
   */
  offset?: number;
};

type ApiDeviceEventRequest = {
  device_id: string;
} & (
  | ApiDeviceRebootEvent
  | ApiDeviceSoftwareStatusChangeEvent
  | ApiDeviceHardwareStatusChangeEvent
  | ApiDeviceCreationEvent
  | ApiDeviceInstallationEvent
  | ApiDeviceUninstallEvent
  | ApiDeviceFactoryResetEvent
);

type ApiDeviceEvent = ApiStringEntity &
  ApiDeviceEventRequest & {
    organization_id: string;
  };

type ApiDeviceFactoryResetEvent = {
  type: 'factory-reset';
};

type ApiDeviceHardwareStatusChangeEvent = {
  type: 'status-change-hardware';
  data: ApiDeviceStatusChangeEventData;
};

type ApiDeviceInstallationEventData = {
  location: ApiLocation;
};

type ApiDeviceInstallationEvent = {
  type: 'installation';
  data: ApiDeviceInstallationEventData;
};

type ApiDeviceInstallationRequest = {
  location_id: string;
  /**
   * Specific place within the location where the device is installed
   */
  placement: string;
};

type ApiDeviceRebootEvent = {
  type: 'reboot';
};

type ApiDeviceRequest = {
  /**
   * References an ApiLocation object where the device is installed
   */
  location_id?: string;
  /**
   * Specific place within the location where the device is installed
   */
  placement?: string;
  /**
   * YYYY-MM-DD formatted date
   */
  license_expiry?: string;
  /**
   * YYYY-MM-DD formatted date
   */
  warranty_expiry?: string;
};

type ApiDeviceSoftwareStatusChangeEvent = {
  type: 'status-change-software';
  data: ApiDeviceStatusChangeEventData;
};

type ApiDeviceState = 'created' | 'installed';

type ApiDeviceStatusChangeEventData = {
  online: boolean;
};

type ApiDeviceStatus = {
  hardware_online: boolean;
  software_online: boolean;
  last_seen?: string;
};

type ApiDevice = ApiStringEntity &
  ApiDeviceDBRequest & {
    status: ApiDeviceStatus;
  };

type ApiDeviceType = 'eloview';

type ApiDeviceUninstallEvent = {
  type: 'uninstall';
};

type ApiEmbeddedUrlLinkedEvent = {
  type: 'embedded_url_linked';
  data: ApiEmbeddedUrlLinkEventData;
};

type ApiEmbeddedUrlLinkEventData = {
  embedded_url_id: string;
};

type ApiEmbeddedUrlRequest = {
  name: string;
  url: string;
  location_ids: Array<string>;
  active_from?: string;
  active_to?: string;
};

type ApiEmbeddedUrl = ApiUuidEntity & ApiEmbeddedUrlRequest;

type ApiEmbeddedUrlUnlinkedEvent = {
  type: 'embedded_url_unlinked';
  data: ApiEmbeddedUrlLinkEventData;
};

type ApiError = {
  /**
   * Error message
   */
  message: string;
};

type ApiLocationCreatedEvent = {
  type: 'location_created';
  data: ApiLocationRequest;
};

type ApiLocationDBRequest = ApiLocationRequest & {
  /**
   * Provider ID for this location
   */
  source_id?: string;
};

type ApiLocationDeletedEvent = {
  type: 'location_deleted';
};

type ApiLocationDeviceEventData = {
  device_id: string;
};

type ApiLocationDeviceInstalledEvent = {
  type: 'device_installed';
  data: ApiLocationDeviceEventData;
};

type ApiLocationDeviceUninstalledEvent = {
  type: 'device_uninstalled';
  data: ApiLocationDeviceEventData;
};

type ApiLocationEventRequest = {
  location_id: string;
} & (
  | ApiLocationDeviceInstalledEvent
  | ApiLocationDeviceUninstalledEvent
  | ApiLocationCreatedEvent
  | ApiLocationUpdatedEvent
  | ApiLocationDeletedEvent
  | ApiApartmentCreatedEvent
  | ApiApartmentUpdatedEvent
  | ApiAnnouncementLinkedEvent
  | ApiAnnouncementUnlinkedEvent
  | ApiAttachmentLinkedEvent
  | ApiAttachmentUnlinkedEvent
  | ApiEmbeddedUrlLinkedEvent
  | ApiEmbeddedUrlUnlinkedEvent
  | ApiTenantMovedInEvent
  | ApiTenantMovedOutEvent
);

type ApiLocationEvent = ApiStringEntity & ApiLocationEventRequest;

type ApiLocationRequest = ApiAddress & {
  /**
   * Property site name
   */
  site_name?: string;
  coordinate?: ApiCoordinate;
};

type ApiLocation = ApiUuidEntity & ApiLocationDBRequest;

type ApiLocationUpdatedEvent = {
  type: 'location_updated';
  data: ApiLocationRequest;
};

type ApiMetadata = {
  /**
   * ISO 8601 date time
   */
  created_at: string;
  /**
   * Auth0 User ID
   */
  created_by: string;
  /**
   * ISO 8601 date time
   */
  updated_at: string;
  /**
   * ISO 8601 date time
   */
  deleted_at?: string;
  /**
   * Auth0 User ID
   */
  deleted_by?: string;
};

type ApiOrganizationRequest = {
  name: string;
  synchronized_types: Array<ApiSynchronizedType>;
};

type ApiOrganization = ApiStringEntity & ApiOrganizationRequest;

type ApiParameterValidationError = {
  /**
   * Error message
   */
  msg: string;
  /**
   * Parameter descriptor
   */
  param: string;
  /**
   * Offending parameter value
   */
  value: string;
  /**
   * Offending parameter location
   */
  location: 'body' | 'query' | 'params' | 'cookies' | 'headers';
  nestedErrors?: Array<ApiParameterValidationError>;
};

type ApiPermission =
  | 'announcements:create'
  | 'announcements:update'
  | 'announcements:delete'
  | 'apartments:create'
  | 'apartments:update'
  | 'apartments:delete'
  | 'attachments:create'
  | 'attachments:update'
  | 'attachments:delete'
  | 'devices:create'
  | 'devices:update'
  | 'devices:delete'
  | 'devices:factory-reset'
  | 'devices:uninstall'
  | 'embedded-urls:create'
  | 'embedded-urls:update'
  | 'embedded-urls:delete'
  | 'locations:create'
  | 'locations:update'
  | 'locations:delete'
  | 'users:read-all';

type ApiProfile = Record<string, any>;

type ApiStringEntity = {
  /**
   * Identifier
   */
  id: string;
  meta: ApiMetadata;
  organization_id: string;
};

type ApiSynchronizedType =
  | 'announcements'
  | 'apartments'
  | 'attachments'
  | 'embedded-urls'
  | 'locations';

type ApiTenantMovedEventData = {
  name: string;
};

type ApiTenantMovedInEvent = {
  type: 'tenant_moved_in';
  data: ApiTenantMovedEventData;
};

type ApiTenantMovedOutEvent = {
  type: 'tenant_moved_out';
  data: ApiTenantMovedEventData;
};

type ApiTenant = {
  id: string;
  first_name: string;
  last_name?: string;
  active_from?: string;
  active_to?: string;
};

type ApiUser = {
  /**
   * User ID
   */
  id: string;
  meta: ApiMetadata;
  /**
   * User full name
   */
  name: string;
  /**
   * User email
   */
  email: string;
};

type ApiUuidEntity = {
  /**
   * Identifier
   */
  id: string;
  meta: ApiMetadata;
  organization_id: string;
};

type ApiValidationError = ApiError & {
  errors?: Array<ApiParameterValidationError>;
};

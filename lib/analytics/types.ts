export type AnalyticsEventType =
  | "page_view"
  | "project_view"
  | "post_view"
  | "cta_click";

export type TrackPayload = {
  event_type: AnalyticsEventType;
  resource_id: string;
  path: string;
};

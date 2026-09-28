// types/returns.ts

export interface ReturnsPolicy {
  title: string;
  description: string;
}

export interface ReturnStep {
  _id?: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface RefundTimelineRow {
  _id?: string;
  method: string;
  timeline: string;
}

export interface ReturnContact {
  title: string;
  description: string;
}

export interface Return {
  _id: string;
  title: string;
  headerBadge: string;
  headerSubtitle: string;
  returnsPolicy: ReturnsPolicy;
  returnSteps: ReturnStep[];
  eligibleItems: string[];
  nonEligibleItems: string[];
  refundTimeline: RefundTimelineRow[];
  contact: ReturnContact;
  isActive: boolean;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Payload sent when creating/updating
export interface ReturnPayload {
  title: string;
  headerBadge: string;
  headerSubtitle: string;
  returnsPolicy: ReturnsPolicy;
  returnSteps: ReturnStep[];
  eligibleItems: string[];
  nonEligibleItems: string[];
  refundTimeline: RefundTimelineRow[];
  contact: ReturnContact;
}

// API Response types
export interface ReturnResponse {
  success: boolean;
  data: Return;
  message?: string;
}

export interface ReturnListResponse {
  success: boolean;
  data: Return[];
  message?: string;
}

export interface DeleteReturnResponse {
  success: boolean;
  message: string;
}
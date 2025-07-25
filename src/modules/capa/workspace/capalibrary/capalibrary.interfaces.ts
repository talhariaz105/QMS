import { Document, ObjectId } from 'mongoose';

export interface LibraryModal extends Document {
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  workspace: ObjectId;
  createdBy: ObjectId;
  isDeleted: boolean;
  status: string;
  members: ObjectId[];
  managers: ObjectId[];
  priority: string;
}

export interface CreateLibraryRequest {
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  workspace: string;
  createdBy: string;
  status: string;
  members?: string[];
  managers?: string[];
  priority?: string;
}

export interface GetLibrariesQuery {
  workspace: string;
  isDeleted?: boolean;
  $or?: [{ name: { $regex: string; $options: string } }, { description: { $regex: string; $options: string } }];
}


export interface forIncludes {
  _id: ObjectId;
  name: string;
  email: string;
  profilePicture: string;
}
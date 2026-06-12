import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['Approved', 'Rejected', 'Refund Initiated', 'Refund Processed', 'Deleted']
  },
  adminId: { type: String, required: true },
  requestId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);

import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
	id: { type: Number },
	type: { type: String, required: true },
	name: { type: String },
	data: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const WorkflowSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	steps: { type: [StepSchema], default: [] },
	created: { type: Date, default: Date.now },
	updated: { type: Date }
});

const Workflow = mongoose.model('Workflow', WorkflowSchema);
export default Workflow;
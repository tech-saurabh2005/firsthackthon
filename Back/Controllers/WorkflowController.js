import Workflow from '../Models/Workflow.js';

export const getWorkflows = async (req, res) => {
	try {
		const workflows = await Workflow.find().sort({ created: -1 });
		res.json(workflows);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const createWorkflow = async (req, res) => {
	try {
		const payload = req.body;
		const workflow = new Workflow({
			name: payload.name,
			description: payload.description || '',
			steps: payload.steps || []
		});
		const created = await workflow.save();
		res.status(201).json(created);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getWorkflowById = async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) return res.status(404).json({ message: 'Workflow not found' });
		res.json(workflow);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateWorkflow = async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

		workflow.name = req.body.name ?? workflow.name;
		workflow.description = req.body.description ?? workflow.description;
		workflow.steps = req.body.steps ?? workflow.steps;
		workflow.updated = new Date();

		const updated = await workflow.save();
		res.json(updated);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const deleteWorkflow = async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) return res.status(404).json({ message: 'Workflow not found' });
		await workflow.remove();
		res.json({ message: 'Workflow deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const importWorkflow = async (req, res) => {
	try {
		if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });
		const json = req.file.buffer.toString('utf8');
		const workflowObj = JSON.parse(json);
		if (!workflowObj.name || !Array.isArray(workflowObj.steps)) {
			return res.status(400).json({ message: 'Invalid workflow format' });
		}
		workflowObj.created = new Date();
		workflowObj.updated = new Date();
		const created = await Workflow.create(workflowObj);
		res.status(201).json(created);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const exportWorkflow = async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

		const filename = `workflow-${workflow._id}.json`;
		res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(workflow, null, 2));
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const executeWorkflow = async (req, res) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

		const report = [];
		for (let i = 0; i < (workflow.steps || []).length; i++) {
			const step = workflow.steps[i];
			report.push({
				step: i + 1,
				type: step.type,
				name: step.name || '',
				status: 'success',
				note: `Simulated execution of ${step.type}`
			});
		}

		res.json({ message: 'Execution simulated', report });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
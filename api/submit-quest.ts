// Simple Express-like API endpoint for quest submissions
// This would normally be in a Next.js API route or Express server

import { addSubmission } from '../services/submissionService';

export async function handleQuestSubmission(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const submission = await addSubmission(req.body);

        // TODO: Send email notification to admin
        // await sendEmail({
        //   to: process.env.ADMIN_EMAIL,
        //   subject: `New Quest Submission: ${submission.projectName}`,
        //   body: `
        //     New quest submission from ${submission.projectName}
        //     
        //     Quest: ${submission.questTitle}
        //     Budget: ${submission.rewardBudget}
        //     Contact: ${submission.contactEmail}
        //     
        //     Review at: ${process.env.ADMIN_URL}/admin
        //   `
        // });

        return res.status(201).json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Quest submission error:', error);
        return res.status(500).json({
            error: 'Failed to save submission'
        });
    }
}

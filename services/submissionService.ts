import fs from 'fs';
import path from 'path';

export interface QuestSubmission {
    id: string;
    projectName: string;
    contractAddress: string;
    questTitle: string;
    questDescription: string;
    questAction: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    category: 'DEFI' | 'NFT' | 'SOCIAL' | 'GOVERNANCE';
    rewardBudget: string;
    rewardType: string;
    contactEmail: string;
    website: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedAt: number;
    reviewedAt?: number;
    reviewNotes?: string;
}

const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'quest-submissions.json');

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// Load all submissions
export function loadSubmissions(): QuestSubmission[] {
    ensureDataDir();

    if (!fs.existsSync(SUBMISSIONS_FILE)) {
        return [];
    }

    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

// Save submissions
function saveSubmissions(submissions: QuestSubmission[]) {
    ensureDataDir();
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

// Add new submission
export async function addSubmission(
    submission: Omit<QuestSubmission, 'id' | 'status' | 'submittedAt'>
): Promise<QuestSubmission> {
    const submissions = loadSubmissions();

    const newSubmission: QuestSubmission = {
        ...submission,
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'PENDING',
        submittedAt: Date.now()
    };

    submissions.push(newSubmission);
    saveSubmissions(submissions);

    // TODO: Send email notification
    console.log(`📧 New quest submission from ${submission.projectName}`);

    return newSubmission;
}

// Update submission status
export function updateSubmissionStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string
): QuestSubmission | null {
    const submissions = loadSubmissions();
    const index = submissions.findIndex(s => s.id === id);

    if (index === -1) {
        return null;
    }

    submissions[index].status = status;
    submissions[index].reviewedAt = Date.now();
    if (reviewNotes) {
        submissions[index].reviewNotes = reviewNotes;
    }

    saveSubmissions(submissions);
    return submissions[index];
}

// Get pending submissions
export function getPendingSubmissions(): QuestSubmission[] {
    return loadSubmissions().filter(s => s.status === 'PENDING');
}

// Get all submissions (for admin)
export function getAllSubmissions(): QuestSubmission[] {
    return loadSubmissions();
}

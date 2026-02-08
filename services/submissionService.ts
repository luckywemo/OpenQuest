import fs from 'fs';
import path from 'path';
import { kv } from './redisService';

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

function ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadSubmissionsFs(): QuestSubmission[] {
    ensureDataDir();
    if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
    } catch {
        return [];
    }
}

function saveSubmissionsFs(subs: QuestSubmission[]) {
    ensureDataDir();
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(subs, null, 2));
}

export async function loadSubmissions(): Promise<QuestSubmission[]> {
    const subs = await kv.get<QuestSubmission[]>('submissions');
    if (subs) return subs;
    return loadSubmissionsFs();
}

export async function addSubmission(
    submission: Omit<QuestSubmission, 'id' | 'status' | 'submittedAt'>
): Promise<QuestSubmission> {
    const submissions = await loadSubmissions();

    const newSubmission: QuestSubmission = {
        ...submission,
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'PENDING',
        submittedAt: Date.now()
    };

    submissions.push(newSubmission);
    await kv.set('submissions', submissions);
    saveSubmissionsFs(submissions);

    console.log(`📧 New quest submission from ${submission.projectName}`);
    return newSubmission;
}

export async function updateSubmissionStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string
): Promise<QuestSubmission | null> {
    const submissions = await loadSubmissions();
    const index = submissions.findIndex(s => s.id === id);

    if (index === -1) return null;

    submissions[index].status = status;
    submissions[index].reviewedAt = Date.now();
    if (reviewNotes) {
        submissions[index].reviewNotes = reviewNotes;
    }

    await kv.set('submissions', submissions);
    saveSubmissionsFs(submissions);
    return submissions[index];
}

export async function getPendingSubmissions(): Promise<QuestSubmission[]> {
    const subs = await loadSubmissions();
    return subs.filter(s => s.status === 'PENDING');
}

export async function getAllSubmissions(): Promise<QuestSubmission[]> {
    return await loadSubmissions();
}

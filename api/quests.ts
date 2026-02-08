import { getActiveQuests } from '../services/questService';

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const quests = await getActiveQuests();
        return res.status(200).json(quests);
    } catch (error) {
        console.error('Error fetching quests:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { getEnumKeyByValue } from '@/lib/utils';
import { Usages } from '@/lib/definitions';

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            institution,
            locationId,
            bucket,
            usage,
            startDate,
            endDate,
            format
        } = await req.json();

        // Update user's institution
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                institution: institution
            }
        });

        // Create request record
        await prisma.request.create({
            data: {
                userId: session.user.id,
                location_id: locationId.toString(),
                usage: getEnumKeyByValue(Usages, usage as string),
                bucket: bucket,
                format: format,
                startDate: startDate,
                endDate: endDate,
                is_delivered: true
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json(
            { error: 'Failed to update database' },
            { status: 500 }
        );
    }
}
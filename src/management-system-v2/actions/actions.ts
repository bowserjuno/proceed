'use server';

import jwt from 'jsonwebtoken';
import { getProcess, updateProcessMetaData } from '@/lib/data/legacy/_process';

export interface TokenPayload {
  processId: string | string[];
  embeddedMode?: boolean;
}

export async function generateToken(payload: TokenPayload) {
  const secretKey = process.env.JWT_KEY;
  const processData = await getProcess(payload.processId);
  const token = jwt.sign(payload, secretKey!);

  return { token, processData };
}

export interface ProcessGuestAccessRights {
  shared: boolean;
  sharedAs?: 'public' | 'protected';
}

export async function updateProcessGuestAccessRights(
  processId: string | string[],
  newMeta: ProcessGuestAccessRights,
) {
  await updateProcessMetaData(processId, newMeta);
}

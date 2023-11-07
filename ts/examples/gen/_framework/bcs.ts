import { BCS, getSuiMoveConfig } from '@mysten/bcs'

export const bcsSource = new BCS(getSuiMoveConfig())
export const bcsOnchain = new BCS(getSuiMoveConfig())

export type Encoding = 'base58' | 'base64' | 'hex'

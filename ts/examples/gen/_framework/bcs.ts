import { BCS, getSuiMoveConfig } from '@mysten/bcs'

export const bcsSource = new BCS(getSuiMoveConfig())
export const bcsOnchain = new BCS(getSuiMoveConfig())

export type Letter = {
    // uuidv4
    id: string
    // the char code - 64. A = 1, B = 2
    value: number
    // A, B, C etc yk
    key: string

    row: number

    column: number

    ref?: HTMLDivElement | null

}

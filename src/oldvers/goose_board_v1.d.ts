export type Coordinates = {
    x: number;
    y: number;
}

export type MoveEvent = {
    nbPos: number;
    text: string;
    movetype: 'relative' | 'absolute';
    type: 'move';
}

export type Event = MoveEvent;

export type SlotBase = {
    pos: Coordinates;
}

export type GameSlot = SlotBase & {
    type: 'GameSlot';
    onWin?: Event;
    onLose?: Event;
}

export type EventSlot = SlotBase & {
    type: 'EventSlot';
    event: Event;
}

export type TagSelectorSlot = GameSlot & {
    selector: 'TagSelector';
    tags: string[]
};

export type TypeSelectorSlot = GameSlot & {
    selector: 'TypeSelector';
    types: string[]
}

export type Slot = TagSelectorSlot | TypeSelectorSlot | EventSlot;

export const curVer = 1
export type GooseBoard = {
    slots: Slot[];
    winPos: Coordinates;
    version: typeof curVer
};

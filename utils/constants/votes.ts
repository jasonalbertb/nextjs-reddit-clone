const types = {
    UPVOTE: 'upvote',
    DOWNVOTE: 'downvote',
} as const;

type Keys = keyof typeof types;
export type VoteType = typeof types[Keys]; 

const joinTypes = {
    join: 'join',
    leave: 'leave',
} as const;

type joinKeys = keyof typeof joinTypes;
export type JoinType = typeof joinTypes[joinKeys]; 


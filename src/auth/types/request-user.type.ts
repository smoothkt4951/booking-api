export type RequestUser = Express.User & {
    userId: number;
    userRole: string;
};

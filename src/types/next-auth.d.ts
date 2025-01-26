import "next-auth"

declare module 'next-auth'{
    interface User{
        _id: string;
        isVerified: boolean;
        username?: string;
        createdAt?: Date;
    }

    interface Session{
        user: {
            _id: string;
            isVerified: boolean;
            username?: string;
            createdAt?: Date;
        } & DefaultSession['user']
    }
}

// export module 'next-auth/jwt'{
//     interface JWT {
//         _id: string;
//         isVerified: boolean;
//         username?: string;
//     }
// }
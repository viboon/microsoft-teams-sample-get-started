// Note: this code saves user id/token in memory, but in production quality project they should be saved in a persistent storage that supports read-after-write consistency

export class UserStore {
    private userTokenMap: { [key: string]: string } = {};
    private userTokenMapUnverified: { [key: string]: {token: string, authCode: string} } = {};

    isUserAuthenticated(userId: string) {
        return !!this.userTokenMap[userId];
    }

    getUserToken(userId: string) {
        return this.userTokenMap[userId];
    }

    revokeUserToken(userId: string) {
        this.userTokenMap[userId] = null;
    }

    queueTokenToVerify(userId: string, token: string, authCode: string) {
        this.userTokenMapUnverified[userId] = { token: token, authCode: authCode };
    }

    verifyUserToken(userId: string, authCode: string) {
        if (this.userTokenMapUnverified[userId] && this.userTokenMapUnverified[userId].authCode == authCode) {
            this.userTokenMap[userId] = this.userTokenMapUnverified[userId].token;
            this.userTokenMapUnverified[userId] = null;
            return true;
        }
        return false;
    }
}

module.exports = new UserStore();
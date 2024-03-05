export function initializeApp() {
    return (): Promise<any> => {
        return new Promise((resolve, reject) => {
            console.log("initialized")
            resolve(true);
        });
    }
}
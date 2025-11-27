interface MongooseConnection {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}
declare const mongooseConnection: MongooseConnection;
export default mongooseConnection;
//# sourceMappingURL=database.d.ts.map
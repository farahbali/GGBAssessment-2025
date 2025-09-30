import { DatabaseConfig } from '../types';
declare const dbConfig: DatabaseConfig;
declare const connectDB: () => Promise<void>;
declare const checkDatabaseHealth: () => Promise<{
    status: "connected" | "disconnected";
    responseTime?: number;
    error?: string;
}>;
declare const getConnectionStatus: () => boolean;
declare const closeDB: () => Promise<void>;
export { connectDB, closeDB, checkDatabaseHealth, getConnectionStatus, dbConfig };
//# sourceMappingURL=database.d.ts.map
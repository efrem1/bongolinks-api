import fs from "fs/promises";
const path = require('path');

export class FileSystem {

    /**
     *
     * @param filename
     */
    public static resolve(filename: string): string {
        return path.resolve(__dirname, filename);
    }

    /**
     *
     * @param filename
     */
    public static async readFileSync(filename: string): Promise<string> {
        const file_path = FileSystem.resolve(filename);
        return  await fs.readFile(FileSystem.resolve(file_path), 'utf8');
    }
}
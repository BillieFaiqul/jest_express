const { PostgreConnection } = require ("../../utils")

class UserModel{
    constructor(){
        this.db = new PostgreConnection();
    }

    async findById(id){
        const sql = `SELECT * FROM users WHERE id = $1`;
        const params = [id]

        try{
            const result = await this.db.query(sql, params)
            return result.length > 0 ? result[0] : null;
        }catch(error){
            await this.db.close();
            throw error;
        }
    }

    async findByEmail(email){
        const sql = `SELECT * FROM users WHERE email = $1`;
        const params = [email];

        try {
            const result = await this.db.query(sql,params);
            return result.length > 0 ? result[0] : null; 
        }catch(error){
            await this.db.close();
            throw error;
        }

    }
    
    async create(data){
        const sql = `
            INSERT INTO users(id, full_name, email, password, created_at, updated_at)
            VALUES($1, $2, $3, $4, NOW(), null)
        `;
        const params = [
            data.id,
            data.full_name,
            data.email,
            data.password
        ];
        try {
            const result = await this.db.query(sql, params);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            await this.db.close();
            throw error;
        }
    }
}

module.exports = UserModel
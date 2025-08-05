const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileStorage {
  constructor() {
    this.usersDir = path.join(__dirname, '..', '..', 'data', 'users');
    this.usersFile = path.join(this.usersDir, 'users.json');
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    try {
      await fs.mkdir(this.usersDir, { recursive: true });
      
      // Create users.json if it doesn't exist
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  async getAllUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  async saveAllUsers(users) {
    try {
      await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error saving users file:', error);
      throw new Error('Failed to save user data');
    }
  }

  async findUserByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }

  async createUser(userData) {
    const users = await this.getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user with ID
    const newUser = {
      id: crypto.randomUUID(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await this.saveAllUsers(users);
    
    return newUser;
  }

  async updateUser(id, updateData) {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.saveAllUsers(users);
    return users[userIndex];
  }

  async deleteUser(id) {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (users.length === filteredUsers.length) {
      throw new Error('User not found');
    }

    await this.saveAllUsers(filteredUsers);
    return true;
  }

  // Get the file path for viewing
  getUsersFilePath() {
    return this.usersFile;
  }
}

module.exports = new FileStorage();
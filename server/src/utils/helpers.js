const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const helpers = {
  generateRandomToken: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },

  generateHash: async (data, saltRounds = 12) => {
    try {
      return await bcrypt.hash(data, saltRounds);
    } catch (error) {
      throw new Error('Hashing failed');
    }
  },

  compareHash: async (data, hash) => {
    try {
      return await bcrypt.compare(data, hash);
    } catch (error) {
      throw new Error('Hash comparison failed');
    }
  },

  sanitizeUser: (user) => {
    const { password, __v, ...sanitizedUser } = user.toObject ? user.toObject() : user;
    return sanitizedUser;
  },

  generatePagination: (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      current: page,
      pages: totalPages,
      total,
      hasNext,
      hasPrev,
      next: hasNext ? page + 1 : null,
      prev: hasPrev ? page - 1 : null
    };
  },

  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatDate: (date, locale = 'en-US') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  slugify: (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  generateOrderNumber: () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  },

  calculateDiscount: (originalPrice, discountPercent) => {
    const discount = (originalPrice * discountPercent) / 100;
    return {
      discount,
      finalPrice: originalPrice - discount
    };
  },

  parseQueryParams: (query) => {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search = '',
      ...filters
    } = query;

    return {
      page: parseInt(page) || 1,
      limit: Math.min(parseInt(limit) || 10, 100), // Max 100 items per page
      sort,
      order: order.toLowerCase() === 'asc' ? 1 : -1,
      search: search.trim(),
      filters
    };
  },

  buildSearchQuery: (searchTerm, fields = []) => {
    if (!searchTerm || fields.length === 0) return {};

    return {
      $or: fields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' }
      }))
    };
  },

  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  removeEmptyFields: (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) =>
        value !== null && value !== undefined && value !== ''
      )
    );
  },

  capitalizeFirst: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  generateApiResponse: (success, data = null, message = '', errors = null) => {
    return {
      success,
      data,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = helpers;

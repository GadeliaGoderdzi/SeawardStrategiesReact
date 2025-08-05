const dataController = {
  async getData(req, res) {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const data = await DataModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      const total = await DataModel.countDocuments(query);

      res.json({
        data,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('Get data error:', error);
      res.status(500).json({ message: 'Server error while fetching data' });
    }
  },

  async getDataById(req, res) {
    try {
      const { id } = req.params;

      const data = await DataModel.findById(id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json({ data });
    } catch (error) {
      console.error('Get data by ID error:', error);
      res.status(500).json({ message: 'Server error while fetching data' });
    }
  },

  async createData(req, res) {
    try {
      const { name, description, category, tags } = req.body;

      const newData = new DataModel({
        name,
        description,
        category,
        tags,
        createdBy: req.userId
      });

      const savedData = await newData.save();

      res.status(201).json({
        message: 'Data created successfully',
        data: savedData
      });
    } catch (error) {
      console.error('Create data error:', error);
      res.status(500).json({ message: 'Server error while creating data' });
    }
  },

  async updateData(req, res) {
    try {
      const { id } = req.params;
      const { name, description, category, tags } = req.body;

      const data = await DataModel.findById(id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      const updatedData = await DataModel.findByIdAndUpdate(
        id,
        { name, description, category, tags, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      res.json({
        message: 'Data updated successfully',
        data: updatedData
      });
    } catch (error) {
      console.error('Update data error:', error);
      res.status(500).json({ message: 'Server error while updating data' });
    }
  },

  async deleteData(req, res) {
    try {
      const { id } = req.params;

      const data = await DataModel.findById(id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      await DataModel.findByIdAndDelete(id);

      res.json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error('Delete data error:', error);
      res.status(500).json({ message: 'Server error while deleting data' });
    }
  },

  async getStats(req, res) {
    try {
      const totalCount = await DataModel.countDocuments();
      const categoryStats = await DataModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const recentData = await DataModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name createdAt category');

      res.json({
        stats: {
          total: totalCount,
          categories: categoryStats,
          recent: recentData
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Server error while fetching stats' });
    }
  }
};

module.exports = dataController;

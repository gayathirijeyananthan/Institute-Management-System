const getPageOptions = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const regexQuery = (fields, term) => {
  if (!term || !fields?.length) return {};
  return { $or: fields.map((field) => ({ [field]: { $regex: term, $options: 'i' } })) };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const scopedFilters = (req, options = {}) => {
  const filters = {};

  if (!options.platformReadable || req.user.role !== 'Platform Admin') {
    filters.instituteId = req.instituteId;
  }

  if (options.centerSelf && ['Center Admin', 'Lecturer', 'Student'].includes(req.user.role)) {
    delete filters.instituteId;
    filters._id = req.centerId;
  }

  if (options.centerScoped && ['Center Admin', 'Lecturer', 'Student'].includes(req.user.role)) {
    filters.centerId = req.centerId;
  }

  if (options.studentScoped && req.user.role === 'Student') {
    filters.studentId = req.studentId;
  }

  return filters;
};

const scopedPayload = (req, payload, options = {}) => {
  const nextPayload = { ...payload };
  if (req.user.role !== 'Platform Admin') nextPayload.instituteId = req.instituteId;
  if (options.centerScoped && ['Center Admin', 'Lecturer', 'Student'].includes(req.user.role)) nextPayload.centerId = req.centerId;
  if (options.studentScoped && req.user.role === 'Student') nextPayload.studentId = req.studentId;
  return nextPayload;
};

export const createCrudController = (Model, options = {}) => ({
  async list(req, res, next) {
    try {
      const { page, limit, skip } = getPageOptions(req);
      const filters = { ...scopedFilters(req, options), ...regexQuery(options.searchFields, req.query.search) };

      for (const field of options.filterFields || []) {
        if (req.query[field]) filters[field] = req.query[field];
      }

      if (options.letterField && req.query.letter) {
        filters[options.letterField] = { $regex: `^${escapeRegex(req.query.letter.slice(0, 1))}`, $options: 'i' };
      }

      const [items, total] = await Promise.all([
        Model.find(filters).populate(options.populate || '').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Model.countDocuments(filters)
      ]);

      res.json({ items, page, pages: Math.ceil(total / limit) || 1, total });
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const item = await Model.findOne({ _id: req.params.id, ...scopedFilters(req, options) }).populate(options.populate || '');
      if (!item) {
        res.status(404);
        throw new Error('Resource not found');
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const payload = scopedPayload(req, req.body, options);
      if (req.file) payload[options.fileField || 'profileImage'] = `/uploads/${req.file.filename}`;
      const item = await Model.create(payload);
      if (options.afterCreate) await options.afterCreate(item, req);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const payload = { ...req.body };
      delete payload.instituteId;
      if (req.file) payload[options.fileField || 'profileImage'] = `/uploads/${req.file.filename}`;

      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, ...scopedFilters(req, options) },
        payload,
        { new: true, runValidators: true }
      );
      if (!item) {
        res.status(404);
        throw new Error('Resource not found');
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const item = await Model.findOneAndDelete({ _id: req.params.id, ...scopedFilters(req, options) });
      if (!item) {
        res.status(404);
        throw new Error('Resource not found');
      }
      res.json({ message: 'Resource deleted' });
    } catch (error) {
      next(error);
    }
  }
});

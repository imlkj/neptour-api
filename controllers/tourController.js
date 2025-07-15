import Tour from "../models/tourModel.js";

export const createTours = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
    console.error(err);
  }
};

export const getAllTours = async (req, res) => {
  try {
    // STEP 1: Build queryObj from req.query
    const queryObj = {};
    // console.log(req.query);
    Object.entries(req.query).forEach(([key, value]) => {
      const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
      // console.log(match);
      if (match) {
        // eslint-disable-next-line no-unused-vars
        const [_, field, operator] = match;
        if (!queryObj[field]) queryObj[field] = {};
        queryObj[field][`$${operator}`] = value;
      } else {
        queryObj[key] = value;
      }
    });

    // STEP 2: Remove fields not meant for filtering
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // STEP 3: Debug log
    // console.log("Query Object:", queryObj);

    // STEP 4: Turn into query string for Mongoose (if needed)
    let queryStr = JSON.stringify(queryObj);

    // Optional: show after replacing comparison operators
    // Actually, they're already formatted with `$gte`, so this step is no longer needed
    // console.log("Query String for Mongoose:", queryStr);

    

    // STEP 5: Execute query with Mongoose
    let query = Tour.find(JSON.parse(queryStr));
    
    // console.log(req.query.sort);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    
    // STEP 6: Send response
    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tour.length,
      data: {
        tours: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
    console.error(err);
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
    console.error(err);
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, {
      new: true,
    });
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
    console.error(err);
  }
};

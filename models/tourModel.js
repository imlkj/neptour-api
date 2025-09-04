import mongoose from "mongoose";
import slugify from "slugify";
import { User } from "./userModel.js";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain letters"],
    },
    duration: {
      type: Number,
      required: [true, "A tours must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have groupt size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // NOTE "this" only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below than regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
}); //mongoose method

tourSchema.pre("save", async function (next) {
  const guidesPromise = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromise);
  next();
});

// NOTE Document Middleware: runs before .save() and .create() validate(), remove(), it doesn't work on update()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query Middleware, run this middlware with every find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//NOTE Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

tourSchema.post("save", function (doc, next) {
  // console.log(doc);
  const time = Number(Date.now() - this.start);
  console.log(`Completion time ${time}`);
  // Number(Date.now() - this.start);
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

export default Tour;

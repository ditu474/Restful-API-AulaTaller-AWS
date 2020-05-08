const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tiposervicioRouter = require("./routes/tiposervicioRoutes");
const userRouter = require("./routes/userRoutes");
const asignaturaRouter = require("./routes/asignaturaRoutes");
const servicioRouter = require("./routes/servicioRoutes");
const asistenciaRouter = require("./routes/asistenciaRoutes");
const valoracionRouter = require("./routes/valoracionRoutes");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Maximo de peticiones, intenta de nuevo en una hora",
});
app.use("/", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tiposervicio", tiposervicioRouter);
app.use("/api/v1/asignaturas", asignaturaRouter);
app.use("/api/v1/servicios", servicioRouter);
app.use("/api/v1/asistencia", asistenciaRouter);
app.use("/api/v1/valoracion", valoracionRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`No se encontro ${req.originalUrl} en este servidor`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

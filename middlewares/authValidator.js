const { body, param } = require("express-validator");

exports.signUpValidator = [nameValidator()]

const validator = ({bodyName, })

const emailValidator = body("email")
.notEmpty()
.withMessage("Email is required")
.bail()
.isEmail()
.withMessage("Invalid email")
.bail()
.escape()
.trim();

const passwordValidator = body("password")
.notEmpty()
.withMessage("Password is required")
.bail()
.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
.withMessage("Password must contain one uppercase, one lowercase, one number and 8 characters")
.bail()
.escape()
.trim()

const confirmPasswordValidator = body('confirmPassword')
.exists()
.withMessage("You must confirm your password")
.bail()
.custom((value, { req }) => value === req.body.password)
.withMessage("confirmPassword must be equal to password")

const nameValidator = body("name")
.notEmpty()
.withMessage("Name is required")
.bail()
.matches(/^[a-zA-ZÀ-ú]+(([',. -][a-zA-ZÀ-ú])?[a-zA-ZÀ-ú]*)*$/)
.withMessage("Invalid name")
.bail()
.escape()
.trim();

const typeOfDocumentValidator = body('typeOfDocument')
.notEmpty()
.withMessage('typeOfDocument no puede ser núlo')
.bail()
.custom((val) => ['TI', 'CC', 'CE', 'Pasaporte'].includes(val))
.withMessage('typeOfDocument solo puede ser TI, CC, CE ó Pasaporte')
.bail()
.escape()
.trim();

const documentValidator = body('document')
.notEmpty()
.withMessage('document no puede ser núlo')
.bail()
.isAlphanumeric()
.withMessage('document inválido')
.bail()
.isLength({max:15,min:8})
.withMessage('document debe tener mínimo 8 caracteres y máximo 15')
.bail()
.escape()
.trim();

const roleValidator = body('role')
.notEmpty()
.withMessage('role no puede ser núlo')
.bail()
.custom((val)=>['Docente', 'Estudiante', 'Externo'].includes(val))
.withMessage('role solo puede ser Docente, Estudiante o Externo')
.bail()
.escape()
.trim();

const campusValidator = body('campus')
.custom((val)=>['Medellin', 'Oriente', 'Uraba'].includes(val))
.withMessage('campus solo puede ser Medellin, Oriente o Uraba')
.bail()
.escape()
.trim();

const semesterValidator = body('semester')
.isInt()
.withMessage('semester solo puede ser un numero entero')
.bail()
.custom((val)=> val>0 && val<10)
.withMessage('semester solo puede est')

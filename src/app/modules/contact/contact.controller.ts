import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../middleware/sendResponse";
import { createContact } from "./contact.service";
import { StatusCodes } from "http-status-codes";

const createContactController = catchAsync(async (req, res) => {
    const result = await createContact(req.body);
   sendResponse(res, {statusCode: StatusCodes.OK, success: true, message: "Email sent successfully", data: result});
});

export const contactController = {
    createContactController
}

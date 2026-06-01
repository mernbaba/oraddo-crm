const express = require("express");
const router = express.Router();
const SharedNotes = require("../models/SharedNotesModel");
const EmpNotes = require("../models/notes");
const Employee = require("../models/Emp_onboarding");

// router.post("/shareNote", async (req, res) => {
//     const { noteId, sharedWithEmployeeIds, sharedByEmployeeId } = req.body;

//     try {
//         // Find existing shared notes for the given noteId and sharedWithEmployeeIds
//         const existingSharedNotes = await SharedNotes.findAll({
//             where: {
//                 noteId,
//                 sharedWithEmployeeId: sharedWithEmployeeIds,
//             },
//         });

//         // Extract already shared employee IDs
//         const existingEmployeeIds = existingSharedNotes.map((note) => note.sharedWithEmployeeId);

//         // Filter out the IDs that are already shared
//         const newEmployeeIds = sharedWithEmployeeIds.filter(
//             (employeeId) => !existingEmployeeIds.includes(employeeId)
//         );

//         // Prepare data for bulk insertion
//         const sharedNotesData = newEmployeeIds.map((employeeId) => ({
//             noteId,
//             sharedWithEmployeeId: employeeId,
//             sharedByEmployeeId,
//         }));

//         // Check if there are any new employees to share the note with
//         if (sharedNotesData.length > 0) {
//             // Bulk insert the new shared notes
//             const sharedNotes = await SharedNotes.bulkCreate(sharedNotesData);
//             return res.status(201).json({ message: "Notes shared successfully", sharedNotes });
//         }

//         res.status(200).json({ message: "No new collaborators to add" });
//     } catch (error) {
//         console.error("Error sharing notes:", error);
//         res.status(500).json({ error: "Error sharing notes" });
//     }
// });

router.post("/shareNote", async (req, res) => {
    const { noteId, sharedWithEmployeeIds, sharedByEmployeeId } = req.body;

    try {
        // Find existing shared notes for the given noteId
        const existingSharedNotes = await SharedNotes.findAll({
            where: { noteId },
        });

        // Extract already shared employee IDs
        const existingEmployeeIds = existingSharedNotes.map((note) => note.sharedWithEmployeeId);

        // Filter out the IDs that are already shared
        const newEmployeeIds = sharedWithEmployeeIds.filter(
            (employeeId) => !existingEmployeeIds.includes(employeeId)
        );

        // Prepare data for bulk insertion
        const sharedNotesData = newEmployeeIds.map((employeeId) => ({
            noteId,
            sharedWithEmployeeId: employeeId,
            sharedByEmployeeId,
        }));

        // Check for employees to be removed (those not in the new list)
        const removedEmployeeIds = existingEmployeeIds.filter(
            (employeeId) => !sharedWithEmployeeIds.includes(employeeId)
        );

        // Remove rows for employees who are no longer shared
        if (removedEmployeeIds.length > 0) {
            await SharedNotes.destroy({
                where: {
                    noteId,
                    sharedWithEmployeeId: removedEmployeeIds,
                },
            });
        }

        // Check if there are any new employees to share the note with
        if (sharedNotesData.length > 0) {
            // Bulk insert the new shared notes
            const sharedNotes = await SharedNotes.bulkCreate(sharedNotesData);
            return res.status(201).json({ message: "Notes shared successfully", sharedNotes });
        }

        res.status(200).json({ message: "No new collaborators to add or remove" });
    } catch (error) {
        console.error("Error sharing notes:", error);
        res.status(500).json({ error: "Error sharing notes" });
    }
});


router.get("/sharedNotes/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
    console.log(employeeId, "from shared notes");
    try {
        const sharedNotes = await SharedNotes.findAll({
            where: { sharedWithEmployeeId: employeeId },
            include: [
                {
                    model: Employee,
                    as: "sharedByEmployee",
                    attributes: ["id", "emp_name", "image_URL"]
                },
                {
                    model: Employee,
                    as: "sharedWithEmployee",
                    attributes: ["id", "emp_name", "image_URL"]
                },
                {
                    model: EmpNotes,
                    // attributes: ["id", "title", "notes"] 
                }
            ]
        });

        res.json(sharedNotes);
    } catch (error) {
        console.error("Error fetching shared notes:", error);
        res.status(500).json({ error: "Error fetching shared notes" });
    }
});


router.get("/sharedEmployees/:noteId", async (req, res) => {
    const { noteId } = req.params;
    console.log(noteId, "from shared notes");

    try {
        const sharedNotes = await SharedNotes.findAll({
            where: { noteId: noteId },
            include: [
                {
                    model: Employee,
                    as: "sharedWithEmployee",
                    attributes: ["id", "emp_name", "image_URL"]
                },
                {
                    model: Employee,
                    as: "sharedByEmployee",
                    attributes: ["id", "emp_name", "image_URL"]
                },
                {
                    model: EmpNotes,
                    attributes: ["id", "title", "notes"]
                }
            ]
        });

        const sharedEmployees = sharedNotes.map(note => note.sharedWithEmployee);

        res.json({ sharedEmployees });
    } catch (error) {
        console.error("Error fetching shared notes:", error);
        res.status(500).json({ error: "Error fetching shared notes" });
    }
});


router.get("/employeesforNotes/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id, "from shared notes");
    try {
        const employees = await Employee.findAll({
            where: {
                orgnaizationId: id,
                isDelete: false
            },
            attributes: ["id", "emp_name", "image_URL"]
        });
        res.json(employees);
    }
    catch (error) {
        console.error("Error fetching shared notes:", error);
        res.status(500).json({ error: "Error fetching shared notes" });
    }
});



module.exports = router;

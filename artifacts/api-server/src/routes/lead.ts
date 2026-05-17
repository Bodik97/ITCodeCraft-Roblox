import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { SubmitLeadBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/lead", async (req, res): Promise<void> => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { parentName, phone, childAge } = parsed.data;

  const [lead] = await db
    .insert(leadsTable)
    .values({ parentName, phone, childAge })
    .returning();

  req.log.info({ leadId: lead.id }, "Lead created");

  res.status(201).json({ id: lead.id, message: "Заявку прийнято! Ми зв'яжемося з вами найближчим часом." });
});

export default router;

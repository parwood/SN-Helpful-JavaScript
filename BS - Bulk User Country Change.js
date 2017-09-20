var gr = new GlideRecord("sys_user");
gr.query();
while(gr.next())  {
  gr.country.setValue("US");
  gr.setWorkflow(false);
  gr.update();
}

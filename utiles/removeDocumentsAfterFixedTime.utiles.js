import removeFile from "./removeFile.utiles.js";

const removeDocumentsAfterFixedTime = (
  doc,
  deleteAfter = 1000 * 60 * 60 * 24,
  intervalTime = 1000 * 60 * 60 ,
  filter = {}
) => {
  let prevDate = new Date(new Date() - deleteAfter);
  try {
    let interval = setInterval(async() => {
      console.log("interval");
      const docs = await doc.find({ ...filter, createdAt: { $lte: prevDate } });
      doc
        .deleteMany({ ...filter, createdAt: { $lte: prevDate } })
        .then((doc) => {
          console.log(
            "automatic deletion succes deleted count : " + doc.deletedCount
          );
          docs.forEach((d)=>{
            if(d.mediaUrl) removeFile(`public${d.mediaUrl}`);
          })
        })
        .catch((e) => {
          console.log(`automatic deletion failed [${e.message}]`);
        });
    }, intervalTime);
  } catch (e) {
    console.log(`automatic deletion failed [${e.message}]`);
  }
};

export default removeDocumentsAfterFixedTime;

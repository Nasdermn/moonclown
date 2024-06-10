export default function generateFileName(email: string, extension: string) {
  const sanitizedEmail = email.replace(/[@.]/g, '_');

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}_${month}_${year}`;

  const timestamp = currentDate.getTime().toString(36);

  const fileName = `${sanitizedEmail}_${formattedDate}_${timestamp}.${extension}`;

  return fileName;
}

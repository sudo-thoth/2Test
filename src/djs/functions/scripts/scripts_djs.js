

function krakenWebScraper(url, type){
  let link = '';
  if (!url) {
    return;
  }
  axios.get(url).subscribe(
    (response) => {
      const html = response.data; // html
      switch (type) {
        case 'audio':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      case 'video':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      default:
        break;
      }
    },
    (error) => {
      console.log(error);
    }
  );
  return link;

}


module.exports = {
    getInteractionObj,
    geMemberInfoObj,
    krakenWebScraper,
}
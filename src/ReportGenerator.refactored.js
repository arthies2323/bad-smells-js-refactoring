const STANDARD_USER_MAX_VALUE = 500;
const ADMIN_PRIORITY_MIN_VALUE = 1000;

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const visibleItems = this.selectItems(user, items);
    const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
    if (reportType === 'CSV') {
      return this.buildCsv(user, visibleItems, total).trim();
    }
    if (reportType === 'HTML') {
      return this.buildHtml(user, visibleItems, total).trim();
    }
    return '';
  }

  selectItems(user, items) {
    if (user.role === 'ADMIN') {
      for (const item of items) {
        if (item.value > ADMIN_PRIORITY_MIN_VALUE) {
          item.priority = true;
        }
      }
      return items;
    }
    if (user.role === 'USER') {
      return items.filter((item) => item.value <= STANDARD_USER_MAX_VALUE);
    }
    return [];
  }

  buildCsv(user, items, total) {
    const header = 'ID,NOME,VALOR,USUARIO\n';
    const rows = items.map((item) => `${item.id},${item.name},${item.value},${user.name}\n`).join('');
    return `${header}${rows}\nTotal,,\n${total},,\n`;
  }

  buildHtml(user, items, total) {
    const header = `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    const rows = items.map((item) => this.buildHtmlRow(item)).join('');
    return `${header}${rows}</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
  }

  buildHtmlRow(item) {
    const style = item.priority ? ' style="font-weight:bold;"' : '';
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }
}

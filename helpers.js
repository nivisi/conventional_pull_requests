function isValidTicketNumberFormat(ticketNumber) {
  const upperCaseTicketNumber = ticketNumber.toUpperCase();
  const ticketNumberRegex = /^[A-Z]+-\d+(\,[A-Z]+-\d+)*$/;
  return ticketNumberRegex.test(upperCaseTicketNumber);
}

function validateType(prName) {
  const typeSegment = prName.split(':')[0];
  const typePart = typeSegment.includes('(') ? typeSegment.split('(')[0].trim() : typeSegment.trim();
  return typePart.toLowerCase();
}

function validateTickets(prName) {
  const ticketNumberMatch = prName.match(/\(([^\)]*)\)/);
  if (!ticketNumberMatch) return '';
  const ticketNumberSegment = ticketNumberMatch[1].trim().toUpperCase();
  if (!isValidTicketNumberFormat(ticketNumberSegment)) {
    return '';  // Return empty string if format is invalid
  }
  return `(${ticketNumberSegment})`; // Keep the valid format
}

function validateTask(prName) {
  // Split the PR name by colon and take all parts after the first colon
  const taskSegments = prName.split(':').slice(1);

  // Join the segments back together to form the full task description
  const taskDescription = taskSegments.join(':').trim();

  return taskDescription;
}

function validatePrTitle(title) {
  const type = validateType(title);
  const tickets = validateTickets(title);
  const task = validateTask(title);

  if (!type || !task) {
    return { isValid: false, validTitle: null, error: 'Invalid PR name format' };
  }

  const correctedPrTitle = `${type}${tickets}: ${task}`;
  const isPrTitleValid = title === correctedPrTitle;

  return { isValid: isPrTitleValid, validTitle: correctedPrTitle };
}


export default {
  validatePrTitle
};
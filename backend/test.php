<?php
header('Content-Type: text/plain');

$currTime = new DateTimeImmutable();
$current_time_string = $current_time->format(DateTimeInterface::ATOM);

echo "Hello from PHP {$current_time_string}";
exit();
?>
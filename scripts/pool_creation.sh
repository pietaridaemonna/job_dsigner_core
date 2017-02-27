virsh pool-define-as $1 dir --target $2
virsh pool-start $1
virsh pool-autostart $1

define('ui/components/machine/driver-terraform/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: 'terraform',

    // Write your component here, starting with setting 'model' to a machine with your config populated
    bootstrap: function() {
      let config = this.get('store').createRecord({
        type                  : 'terraformConfig',
        memory                : 8,
        cpuCount              : 2,
        mcpUser               : "",
        mcpPassword           : "",
        mcpRegion             : "AU",
        networkdomain         : "Rancher",
        datacenter            : "AU10",
        vlan                  : "Rancher Primary",
        imageName             : "Ubuntu 14.04 2 CPU",
        sshUser               : "root",
        sshKey                : "/id_rsa",
        sshPort               : 22,
        sshBootstrapPassword  : "5n4u54g3s!!!",
        usePrivateIp          : true,
        createFirewallRule    : false,
        clientPublicIp        : ""
      });

      let type = 'host';

      if (!this.get('useHost')) {
        type = 'machine';
      }

      this.set('model', this.get('store').createRecord({
        type: type,
        'terraformConfig': config,
      }));
    },

    // Add custom validation beyond what can be done from the config API schema
    validate() {
      // Get generic API validation errors
      this._super();
      var errors = this.get('errors')||[];

      // Validate model.
      if (parseInt(this.get('model.terraformConfig.cpuCount'), 10) < 1)
      {
        errors.push('CPU count cannot be less than 1');
      }

      if (parseInt(this.get('model.terraformConfig.memory'), 10) < 1)
      {
        errors.push('Memory cannot be less than 1GB');
      }

      // TODO: Validate other properties.

      // Set the array of errors for display,
      // and return true if saving should continue.
      if (errors.get('length'))
      {
        this.set('errors', errors);

        return false;
      }
      else
      {
        this.set('errors', null);

        return true;
      }
    },

    // Any computed properties or custom logic can go here
  });
});

import {cloneDeep} from "lodash";

const updateDeviceDependency = (dependencies, dependency, functionality, service) => {
    if(!dependency){
        return dependencies;
    }
    const dependentIndex = dependencies.map(dependency => dependency.id).indexOf(dependency.id)
    if(dependentIndex === -1) {
        dependency.services = []
    } else {
        dependency = dependencies[dependentIndex]
    }
    dependency.services.push({
        serviceData: service.service_data,
        functionality
    })
    if(dependentIndex === -1) {
        dependencies.push(dependency);
    } else {
        dependencies[dependentIndex] = dependency;
    }
    return dependencies
}
export const parseDevices = (devices, deviceTypes) => {
    return devices.map((device) => {
        let serverGroups = [];
        let localDevices = [];
        const localFunctionalities = [];
        const deviceType = deviceTypes.find(type => type.id === device.device_type_id);
        if(deviceType && deviceType.functionalities) {
            deviceType.functionalities.forEach(functionality => {
                functionality.active = device.functionalities
                    .some(deviceFunctionality => deviceFunctionality.id === functionality.id)
                if (functionality.services.length === 0) {
                    localFunctionalities.push(functionality)
                } else {
                    functionality.services.forEach(service => {
                        if(!service.server_group && !service.device_type) {
                            const server_group = {
                                id: null,
                                name: 'Any device',
                                locations: []
                            }
                            if(service.cloud) {
                                serverGroups = updateDeviceDependency(serverGroups, server_group, functionality, service);
                            } else {
                                localDevices = updateDeviceDependency(localDevices, server_group, functionality, service);
                            }
                        } else {
                            //setup server groups
                            serverGroups = updateDeviceDependency(serverGroups, service.server_group, functionality, service);
                            //setup local devices
                            localDevices = updateDeviceDependency(localDevices, service.device_type, functionality, service);
                        }

                    })
                }
            })
            localDevices = localDevices.map(localDevice => {
                localDevice.device = device;
                localDevice.active = localDevice.services.some(service => service.functionality.active);
                return localDevice
            })
            serverGroups = serverGroups.map(serverGroup => {
                serverGroup.device = device;
                serverGroup.active = serverGroup.services.some(service => service.functionality.active);
                return serverGroup
            })
        }

        return {
            device,
            serverGroups,
            localDevices,
            localFunctionalities
        }
    })
}
